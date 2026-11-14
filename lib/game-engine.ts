import {
  BUILDING_CATALOG,
  BRIDGE_BONUS_PERCENT,
  MAX_BRIDGES,
  MAX_OFFLINE_SECONDS,
  calculateBuildingPopulation,
  calculateBuildingBaseIncome,
  calculateBuildingRequiredPop,
} from "./game-constants";

export interface BuildingState {
  id: string;
  type: string;
  level: number;
  grid_x: number;
  grid_y: number;
}

export interface CityCalculationResult {
  totalPopulation: number;
  totalRequiredPopulation: number;
  efficiency: number; // 0 to 1 (1.0 = 100% workforce filled)
  baseIncomePerSec: number;
  effectiveIncomePerSec: number;
  bridgeCount: number;
  bridgeMultiplier: number;
  finalIncomePerSec: number;
}

/**
 * Pure calculation function for city economy.
 * Shared between Server (for anti-cheat verification) and Client (for 60fps/1Hz UI rendering).
 */
export function calculateCityEconomy(
  buildings: BuildingState[],
  acceptedBridgesCount: number = 0
): CityCalculationResult {
  let totalPopulation = 0;
  let totalRequiredPopulation = 0;
  let rawCommercialIncome = 0;

  // 1. Calculate population and raw commercial stats
  for (const b of buildings) {
    const def = BUILDING_CATALOG[b.type];
    if (!def) continue;

    if (def.category === "RESIDENTIAL") {
      totalPopulation += calculateBuildingPopulation(b.type, b.level);
    } else if (def.category === "COMMERCIAL") {
      totalRequiredPopulation += calculateBuildingRequiredPop(b.type, b.level);
      rawCommercialIncome += calculateBuildingBaseIncome(b.type, b.level);
    }
  }

  // 2. Population vs Efficiency Logic:
  // If required workforce > 0, efficiency = min(1, totalPopulation / totalRequiredPopulation)
  // If no commercial buildings, efficiency is 1.0 (100%)
  const efficiency =
    totalRequiredPopulation === 0
      ? 1.0
      : Math.min(1.0, totalPopulation / totalRequiredPopulation);

  // Scaled commercial income according to workforce efficiency
  const effectiveIncomePerSec = rawCommercialIncome * efficiency;

  // 3. Tourism Bridge Bonus:
  // Up to 9 active bridges, +5% global boost per bridge
  const clampedBridges = Math.min(MAX_BRIDGES, Math.max(0, acceptedBridgesCount));
  const bridgeMultiplier = 1.0 + clampedBridges * BRIDGE_BONUS_PERCENT;

  // Total income per second with bridge tourism multiplier applied
  const finalIncomePerSec = effectiveIncomePerSec * bridgeMultiplier;

  return {
    totalPopulation,
    totalRequiredPopulation,
    efficiency,
    baseIncomePerSec: rawCommercialIncome,
    effectiveIncomePerSec,
    bridgeCount: clampedBridges,
    bridgeMultiplier,
    finalIncomePerSec,
  };
}

/**
 * Calculates offline earnings with strict 24-hour security limit.
 */
export function calculateOfflineEarnings(
  lastSyncTime: Date | string | number,
  currentTime: Date | string | number,
  incomePerSec: number
): {
  elapsedSeconds: number;
  cappedSeconds: number;
  earnedAmount: number;
  wasCapped: boolean;
} {
  const lastTimeMs = new Date(lastSyncTime).getTime();
  const currTimeMs = new Date(currentTime).getTime();

  if (isNaN(lastTimeMs) || isNaN(currTimeMs) || currTimeMs <= lastTimeMs) {
    return { elapsedSeconds: 0, cappedSeconds: 0, earnedAmount: 0, wasCapped: false };
  }

  const elapsedSeconds = Math.floor((currTimeMs - lastTimeMs) / 1000);
  const cappedSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_SECONDS);
  const wasCapped = elapsedSeconds > MAX_OFFLINE_SECONDS;
  const earnedAmount = cappedSeconds * incomePerSec;

  return {
    elapsedSeconds,
    cappedSeconds,
    earnedAmount,
    wasCapped,
  };
}
