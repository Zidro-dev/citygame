"use client";

import { GRID_SIZE, BUILDING_CATALOG } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Plus,
  Home,
  Building2,
  Store,
  ShoppingBag,
  Briefcase,
  Sparkles,
  Zap,
} from "lucide-react";

interface CityGridProps {
  buildings: BuildingState[];
  onSelectEmptyTile: (x: number, y: number) => void;
  onSelectBuilding: (building: BuildingState) => void;
}

export function CityGrid({
  buildings,
  onSelectEmptyTile,
  onSelectBuilding,
}: CityGridProps) {
  const { t, getBuildingInfo, language } = useLanguage();

  // Map buildings by coordinates "x,y" for O(1) tile lookup
  const buildingMap = new Map<string, BuildingState>();
  for (const b of buildings) {
    buildingMap.set(`${b.grid_x},${b.grid_y}`, b);
  }

  // Helper to render the appropriate icon
  const renderBuildingIcon = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="w-5 h-5 text-blue-300" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-indigo-300" />;
      case "Store":
        return <Store className="w-5 h-5 text-emerald-300" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-5 h-5 text-amber-300" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-cyan-300" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      {/* Grid Controls Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {t("territoryMatrix")}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {t("plotsOccupied", { count: buildings.length })}
          </span>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          {t("gridHint")}
        </div>
      </div>

      {/* Straight, Perfectly Aligned Glass Grid Container */}
      <div className="relative flex items-center justify-center p-4 sm:p-8 rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
        {/* Subtle Futuristic Ground Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0,transparent_75%)] pointer-events-none" />

        {/* Straight 5x5 Grid (No tilt, completely aligned) */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 w-full max-w-2xl mx-auto">
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => {
              const building = buildingMap.get(`${x},${y}`);
              const def = building ? BUILDING_CATALOG[building.type] : null;

              if (building && def) {
                const info = getBuildingInfo(building.type);
                const isCommercial = def.category === "COMMERCIAL";
                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => onSelectBuilding(building)}
                    className="group relative aspect-square rounded-2xl glass-card border border-white/15 p-2 sm:p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_10px_25px_rgba(6,182,212,0.25)] overflow-hidden"
                  >
                    {/* Background glow gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${def.color} opacity-20 group-hover:opacity-35 transition`}
                    />

                    {/* Top row: Icon + Level Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="p-1 sm:p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
                        {renderBuildingIcon(def.iconName)}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-white shadow-sm">
                        {language === "uz" ? "D" : "L"}{building.level}
                      </span>
                    </div>

                    {/* Middle: Name on desktop */}
                    <div className="relative z-10 hidden sm:block">
                      <div className="text-xs font-bold text-white truncate leading-tight">
                        {info.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ({x}, {y})
                      </div>
                    </div>

                    {/* Bottom: Stat tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      {isCommercial ? (
                        <div className="text-[9px] sm:text-[10px] font-bold text-emerald-400 font-mono flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>
                            +${(def.baseIncome * Math.pow(1.4, building.level - 1)).toFixed(1)}{t("perSec")}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[9px] sm:text-[10px] font-bold text-blue-300 font-mono flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                          <span>+{def.basePopulation * building.level} {t("citizens")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Empty Tile
              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => onSelectEmptyTile(x, y)}
                  className="group relative aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-slate-900/40 hover:bg-cyan-500/10 hover:border-cyan-400/50 p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(6,182,212,0.15)]"
                >
                  <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-slate-500 group-hover:text-cyan-300 transition">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 group-hover:text-cyan-300 mt-1">
                    ({x}, {y})
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
