"use server";

import { prisma } from "@/lib/prisma";
import { calculateCityEconomy } from "@/lib/game-engine";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  population: number;
  incomePerSec: number;
  efficiency: number;
  buildingCount: number;
  bridgeCount: number;
}

export async function getLeaderboardDataAction(): Promise<{
  success: boolean;
  error?: string;
  data?: {
    topEarners: LeaderboardEntry[];
    topMegapolises: LeaderboardEntry[];
  };
}> {
  try {
    // Fetch all cities with their buildings and user info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        city: {
          include: {
            buildings: true,
          },
        },
      },
    });

    // Also fetch all accepted bridges to compute exact bridge bonuses
    const acceptedBridges = await prisma.bridgeConnection.findMany({
      where: { status: "ACCEPTED" },
      select: { user_a_id: true, user_b_id: true },
    });

    const bridgeCountsByUser: Record<string, number> = {};
    for (const b of acceptedBridges) {
      bridgeCountsByUser[b.user_a_id] = (bridgeCountsByUser[b.user_a_id] || 0) + 1;
      bridgeCountsByUser[b.user_b_id] = (bridgeCountsByUser[b.user_b_id] || 0) + 1;
    }

    const entries: Omit<LeaderboardEntry, "rank">[] = [];

    for (const user of users) {
      if (!user.city) continue;
      const bCount = bridgeCountsByUser[user.id] || 0;
      const econ = calculateCityEconomy(user.city.buildings, bCount);

      entries.push({
        username: user.username,
        population: econ.totalPopulation,
        incomePerSec: econ.finalIncomePerSec,
        efficiency: econ.efficiency,
        buildingCount: user.city.buildings.length,
        bridgeCount: Math.min(9, bCount),
      });
    }

    // Top Earners: sorted descending by incomePerSec
    const topEarners = [...entries]
      .sort((a, b) => b.incomePerSec - a.incomePerSec)
      .slice(0, 50)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    // Megapolises: sorted descending by population
    const topMegapolises = [...entries]
      .sort((a, b) => b.population - a.population)
      .slice(0, 50)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return {
      success: true,
      data: {
        topEarners,
        topMegapolises,
      },
    };
  } catch (error) {
    console.error("getLeaderboardDataAction error:", error);
    return { success: false, error: "Failed to generate leaderboards" };
  }
}
