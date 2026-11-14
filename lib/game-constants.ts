// Idle City Builder Game Constants & Balancing Rules

export interface BuildingDefinition {
  type: string;
  name: string;
  category: "RESIDENTIAL" | "COMMERCIAL";
  description: string;
  baseCost: number;
  baseIncome: number; // $ per second
  basePopulation: number; // residents provided
  requiredPopulation: number; // workforce required to run at 100%
  color: string;
  iconName: string;
}

export const GRID_SIZE = 5; // 5x5 city grid (0 to 4)
export const MAX_OFFLINE_SECONDS = 24 * 60 * 60; // 24 hours security cap (86,400s)
export const MAX_BRIDGES = 9; // Maximum 9 connected cities
export const BRIDGE_BONUS_PERCENT = 0.05; // +5% global income per active bridge
export const STARTER_BALANCE = 500.0;
export const STARTER_POPULATION = 10;

export const BUILDING_CATALOG: Record<string, BuildingDefinition> = {
  RESIDENTIAL_SMALL: {
    type: "RESIDENTIAL_SMALL",
    name: "Cozy Suburb",
    category: "RESIDENTIAL",
    description: "Affordable housing for new citizens moving into your city.",
    baseCost: 100,
    baseIncome: 0,
    basePopulation: 10,
    requiredPopulation: 0,
    color: "from-blue-500 to-indigo-600",
    iconName: "Home",
  },
  RESIDENTIAL_TOWER: {
    type: "RESIDENTIAL_TOWER",
    name: "Skyline Condo",
    category: "RESIDENTIAL",
    description: "High-density residential complex housing a massive workforce.",
    baseCost: 800,
    baseIncome: 0,
    basePopulation: 45,
    requiredPopulation: 0,
    color: "from-indigo-500 to-purple-600",
    iconName: "Building2",
  },
  COMMERCIAL_SHOP: {
    type: "COMMERCIAL_SHOP",
    name: "Neon Convenience",
    category: "COMMERCIAL",
    description: "Local shop generating steady income. Requires 5 workers.",
    baseCost: 150,
    baseIncome: 6.0, // $6/sec
    basePopulation: 0,
    requiredPopulation: 5,
    color: "from-emerald-500 to-teal-600",
    iconName: "Store",
  },
  COMMERCIAL_MALL: {
    type: "COMMERCIAL_MALL",
    name: "Cyber Metropolis Mall",
    category: "COMMERCIAL",
    description: "Thriving commercial center. Requires 30 workers.",
    baseCost: 1200,
    baseIncome: 55.0, // $55/sec
    basePopulation: 0,
    requiredPopulation: 30,
    color: "from-amber-500 to-orange-600",
    iconName: "ShoppingBag",
  },
  COMMERCIAL_OFFICE: {
    type: "COMMERCIAL_OFFICE",
    name: "Apex Tech Tower",
    category: "COMMERCIAL",
    description: "State-of-the-art corporate hub with huge returns. Requires 90 workers.",
    baseCost: 6000,
    baseIncome: 320.0, // $320/sec
    basePopulation: 0,
    requiredPopulation: 90,
    color: "from-cyan-500 to-blue-600",
    iconName: "Briefcase",
  },
};

/**
 * Calculates the upgrade cost for a building of a given level
 */
export function getUpgradeCost(baseCost: number, currentLevel: number): number {
  return Math.round(baseCost * Math.pow(1.6, currentLevel));
}

/**
 * Calculates effective population from residential buildings
 */
export function calculateBuildingPopulation(type: string, level: number): number {
  const def = BUILDING_CATALOG[type];
  if (!def || def.category !== "RESIDENTIAL") return 0;
  return def.basePopulation * level;
}

/**
 * Calculates raw base income per second for a commercial building at a specific level
 */
export function calculateBuildingBaseIncome(type: string, level: number): number {
  const def = BUILDING_CATALOG[type];
  if (!def || def.category !== "COMMERCIAL") return 0;
  return def.baseIncome * Math.pow(1.4, level - 1);
}

/**
 * Calculates required population for a commercial building
 */
export function calculateBuildingRequiredPop(type: string, level: number): number {
  const def = BUILDING_CATALOG[type];
  if (!def || def.category !== "COMMERCIAL") return 0;
  return Math.round(def.requiredPopulation * Math.pow(1.2, level - 1));
}
