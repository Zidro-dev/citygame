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
  sciencePerSec: number;
  happiness: number; // 0 to 100%
}

/**
 * Pure calculation function for city economy.
 * Shared between Server (for anti-cheat verification) and Client (for 60fps/1Hz UI rendering).
 */
export function calculateCityEconomy(
  buildings: BuildingState[],
  acceptedBridgesCount: number = 0,
  boostMultiplier: number = 1.0
): CityCalculationResult {
  let totalPopulation = 0;
  let totalRequiredPopulation = 0;
  let rawCommercialIncome = 0;
  let sciencePerSec = 0;
  let totalHappinessBonus = 0;

  // 1. Calculate population and raw commercial stats
  for (const b of buildings) {
    const def = BUILDING_CATALOG[b.type];
    if (!def) continue;

    if (def.category === "RESIDENTIAL") {
      totalPopulation += calculateBuildingPopulation(b.type, b.level);
      if (def.happinessBonus) {
        totalHappinessBonus += def.happinessBonus * b.level;
      }
    } else {
      // COMMERCIAL, SCIENCE, ENTERTAINMENT
      totalRequiredPopulation += calculateBuildingRequiredPop(b.type, b.level);
      rawCommercialIncome += calculateBuildingBaseIncome(b.type, b.level);

      if (def.baseScience) {
        sciencePerSec += def.baseScience * b.level;
      }
      if (def.happinessBonus) {
        totalHappinessBonus += def.happinessBonus * b.level;
      }
    }
  }

  // 2. Population vs Efficiency Logic:
  const efficiency =
    totalRequiredPopulation === 0
      ? 1.0
      : Math.min(1.0, totalPopulation / totalRequiredPopulation);

  // Scaled commercial income according to workforce efficiency
  const effectiveIncomePerSec = rawCommercialIncome * efficiency;

  // 3. Tourism Bridge Bonus:
  const clampedBridges = Math.min(MAX_BRIDGES, Math.max(0, acceptedBridgesCount));
  const bridgeMultiplier = 1.0 + clampedBridges * BRIDGE_BONUS_PERCENT;

  // Total income per second with bridge tourism multiplier and active event/minigame boost
  const finalIncomePerSec = effectiveIncomePerSec * bridgeMultiplier * boostMultiplier;

  // 4. Ecology & Happiness (Base 80% + bonuses - deficit penalty)
  const deficitPenalty = efficiency < 1.0 ? Math.round((1.0 - efficiency) * 15) : 0;
  const happiness = Math.min(100, Math.max(20, 80 + totalHappinessBonus - deficitPenalty));

  return {
    totalPopulation,
    totalRequiredPopulation,
    efficiency,
    baseIncomePerSec: rawCommercialIncome,
    effectiveIncomePerSec,
    bridgeCount: clampedBridges,
    bridgeMultiplier,
    finalIncomePerSec,
    sciencePerSec,
    happiness,
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
  const rawElapsed = Math.max(0, Math.floor((currTimeMs - lastTimeMs) / 1000));

  const cappedSeconds = Math.min(rawElapsed, MAX_OFFLINE_SECONDS);
  const wasCapped = rawElapsed > MAX_OFFLINE_SECONDS;
  const earnedAmount = Math.floor(cappedSeconds * incomePerSec * 100) / 100;

  return {
    elapsedSeconds: rawElapsed,
    cappedSeconds,
    earnedAmount,
    wasCapped,
  };
}
