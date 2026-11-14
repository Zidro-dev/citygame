"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  BUILDING_CATALOG,
  GRID_SIZE,
  getUpgradeCost,
} from "@/lib/game-constants";
import {
  calculateCityEconomy,
  calculateOfflineEarnings,
} from "@/lib/game-engine";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Helper to get the number of accepted bridge connections for a user
 */
async function getAcceptedBridgesCount(userId: string): Promise<number> {
  const count = await prisma.bridgeConnection.count({
    where: {
      status: "ACCEPTED",
      OR: [{ user_a_id: userId }, { user_b_id: userId }],
    },
  });
  return count;
}

/**
 * Server Action: Synchronizes balance based strictly on verified server time.
 * Prevents client-side balance manipulation.
 */
export async function syncBalanceAction(): Promise<ActionResult<{
  balance: number;
  last_sync_time: string;
  earnedAmount: number;
  elapsedSeconds: number;
  wasCapped: boolean;
}>> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        city: {
          include: { buildings: true },
        },
      },
    });

    if (!user || !user.city) {
      return { success: false, error: "City not found" };
    }

    const city = user.city;
    const now = new Date();
    const bridgesCount = await getAcceptedBridgesCount(user.id);
    const economy = calculateCityEconomy(city.buildings, bridgesCount);

    const { elapsedSeconds, earnedAmount, wasCapped } = calculateOfflineEarnings(
      city.last_sync_time,
      now,
      economy.finalIncomePerSec
    );

    const newBalance = city.balance + earnedAmount;

    // Update city balance and timestamp
    const updatedCity = await prisma.city.update({
      where: { id: city.id },
      data: {
        balance: newBalance,
        population: economy.totalPopulation,
        last_sync_time: now,
      },
    });

    return {
      success: true,
      data: {
        balance: updatedCity.balance,
        last_sync_time: updatedCity.last_sync_time.toISOString(),
        earnedAmount,
        elapsedSeconds,
        wasCapped,
      },
    };
  } catch (error) {
    console.error("syncBalanceAction error:", error);
    return { success: false, error: "Failed to synchronize city balance" };
  }
}

/**
 * Server Action: Buy a new building on an empty grid tile.
 * Independently validates tile coordinates, occupancy, and fund balance.
 */
export async function buyBuildingAction(
  type: string,
  grid_x: number,
  grid_y: number
): Promise<ActionResult<{
  balance: number;
  building: {
    id: string;
    type: string;
    level: number;
    grid_x: number;
    grid_y: number;
  };
}>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  // Validate coordinates
  if (
    !Number.isInteger(grid_x) ||
    !Number.isInteger(grid_y) ||
    grid_x < 0 ||
    grid_x >= GRID_SIZE ||
    grid_y < 0 ||
    grid_y >= GRID_SIZE
  ) {
    return { success: false, error: "Invalid grid coordinates" };
  }

  // Validate building type
  const def = BUILDING_CATALOG[type];
  if (!def) {
    return { success: false, error: "Unknown building blueprint" };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const city = await tx.city.findUnique({
        where: { user_id: session.userId },
        include: { buildings: true },
      });

      if (!city) throw new Error("City not found");

      // Check if tile is already occupied
      const isOccupied = city.buildings.some(
        (b) => b.grid_x === grid_x && b.grid_y === grid_y
      );
      if (isOccupied) {
        throw new Error("This plot is already occupied by an existing structure");
      }

      // Sync offline earnings up to now first so player gets credit for idle income
      const now = new Date();
      const bridgesCount = await tx.bridgeConnection.count({
        where: {
          status: "ACCEPTED",
          OR: [{ user_a_id: session.userId }, { user_b_id: session.userId }],
        },
      });
      const economyBefore = calculateCityEconomy(city.buildings, bridgesCount);
      const { earnedAmount } = calculateOfflineEarnings(
        city.last_sync_time,
        now,
        economyBefore.finalIncomePerSec
      );

      const currentBalance = city.balance + earnedAmount;

      // Verify sufficient treasury
      if (currentBalance < def.baseCost) {
        throw new Error(
          `Insufficient treasury. Required: $${def.baseCost}, Available: $${currentBalance.toFixed(2)}`
        );
      }

      // Deduct cost and place building
      const remainingBalance = currentBalance - def.baseCost;

      const newBuilding = await tx.building.create({
        data: {
          city_id: city.id,
          type,
          level: 1,
          grid_x,
          grid_y,
        },
      });

      // Recalculate economy with new building
      const updatedBuildings = [...city.buildings, newBuilding];
      const economyAfter = calculateCityEconomy(updatedBuildings, bridgesCount);

      const updatedCity = await tx.city.update({
        where: { id: city.id },
        data: {
          balance: remainingBalance,
          population: economyAfter.totalPopulation,
          last_sync_time: now,
        },
      });

      return {
        success: true,
        data: {
          balance: updatedCity.balance,
          building: {
            id: newBuilding.id,
            type: newBuilding.type,
            level: newBuilding.level,
            grid_x: newBuilding.grid_x,
            grid_y: newBuilding.grid_y,
          },
        },
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to construct building";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Upgrades an existing building.
 * Validates ownership, upgrade cost formula, and player treasury on the server side.
 */
export async function upgradeBuildingAction(
  buildingId: string
): Promise<ActionResult<{
  balance: number;
  building: {
    id: string;
    type: string;
    level: number;
    grid_x: number;
    grid_y: number;
  };
}>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    return await prisma.$transaction(async (tx) => {
      const city = await tx.city.findUnique({
        where: { user_id: session.userId },
        include: { buildings: true },
      });

      if (!city) throw new Error("City not found");

      const building = city.buildings.find((b) => b.id === buildingId);
      if (!building) {
        throw new Error("Building not found in your metropolis");
      }

      const def = BUILDING_CATALOG[building.type];
      if (!def) throw new Error("Unknown building specifications");

      // Calculate server-side upgrade cost
      const upgradeCost = getUpgradeCost(def.baseCost, building.level);

      // Sync earnings up to now
      const now = new Date();
      const bridgesCount = await tx.bridgeConnection.count({
        where: {
          status: "ACCEPTED",
          OR: [{ user_a_id: session.userId }, { user_b_id: session.userId }],
        },
      });
      const economyBefore = calculateCityEconomy(city.buildings, bridgesCount);
      const { earnedAmount } = calculateOfflineEarnings(
        city.last_sync_time,
        now,
        economyBefore.finalIncomePerSec
      );

      const currentBalance = city.balance + earnedAmount;

      if (currentBalance < upgradeCost) {
        throw new Error(
          `Insufficient treasury for upgrade. Required: $${upgradeCost}, Available: $${currentBalance.toFixed(2)}`
        );
      }

      const remainingBalance = currentBalance - upgradeCost;
      const nextLevel = building.level + 1;

      const upgradedBuilding = await tx.building.update({
        where: { id: building.id },
        data: { level: nextLevel },
      });

      // Recalculate economy
      const updatedBuildings = city.buildings.map((b) =>
        b.id === building.id ? upgradedBuilding : b
      );
      const economyAfter = calculateCityEconomy(updatedBuildings, bridgesCount);

      const updatedCity = await tx.city.update({
        where: { id: city.id },
        data: {
          balance: remainingBalance,
          population: economyAfter.totalPopulation,
          last_sync_time: now,
        },
      });

      return {
        success: true,
        data: {
          balance: updatedCity.balance,
          building: {
            id: upgradedBuilding.id,
            type: upgradedBuilding.type,
            level: upgradedBuilding.level,
            grid_x: upgradedBuilding.grid_x,
            grid_y: upgradedBuilding.grid_y,
          },
        },
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upgrade building";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Fetches the full city state for the authenticated player.
 */
export async function getCityStateAction() {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        city: {
          include: { buildings: true },
        },
      },
    });

    if (!user || !user.city) {
      return { success: false, error: "City not found" };
    }

    const bridgesCount = await getAcceptedBridgesCount(user.id);

    return {
      success: true,
      data: {
        city: user.city,
        buildings: user.city.buildings,
        bridgesCount,
      },
    };
  } catch (error) {
    console.error("getCityStateAction error:", error);
    return { success: false, error: "Failed to fetch city state" };
  }
}
