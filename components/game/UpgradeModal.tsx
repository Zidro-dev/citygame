"use client";

import { BUILDING_CATALOG, getUpgradeCost } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  ArrowUpCircle,
  Home,
  Building2,
  Store,
  ShoppingBag,
  Briefcase,
  Loader2,
  Sparkles,
} from "lucide-react";

interface UpgradeModalProps {
  building: BuildingState | null;
  balance: number;
  isActionPending: boolean;
  onClose: () => void;
  onUpgrade: (buildingId: string) => Promise<boolean>;
}

export function UpgradeModal({
  building,
  balance,
  isActionPending,
  onClose,
  onUpgrade,
}: UpgradeModalProps) {
  if (!building) return null;

  const def = BUILDING_CATALOG[building.type];
  if (!def) return null;

  const upgradeCost = getUpgradeCost(def.baseCost, building.level);
  const canAfford = balance >= upgradeCost;
  const isCommercial = def.category === "COMMERCIAL";

  // Current stats
  const currentIncome = def.baseIncome * Math.pow(1.4, building.level - 1);
  const nextIncome = def.baseIncome * Math.pow(1.4, building.level);
  const currentPop = def.basePopulation * building.level;
  const nextPop = def.basePopulation * (building.level + 1);
  const currentReqPop = Math.round(def.requiredPopulation * Math.pow(1.2, building.level - 1));
  const nextReqPop = Math.round(def.requiredPopulation * Math.pow(1.2, building.level));

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="w-6 h-6 text-blue-400" />;
      case "Building2":
        return <Building2 className="w-6 h-6 text-indigo-400" />;
      case "Store":
        return <Store className="w-6 h-6 text-emerald-400" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-6 h-6 text-amber-400" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-cyan-400" />;
      default:
        return <Building2 className="w-6 h-6 text-slate-400" />;
    }
  };

  const handleUpgrade = async () => {
    const success = await onUpgrade(building.id);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/15 p-6 relative overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
              {renderIcon(def.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{def.name}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Level {building.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Grid Plot: ({building.grid_x}, {building.grid_y}) • {def.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upgrade Stat Comparison */}
        <div className="py-5 space-y-3 relative z-10">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Blueprint Modernization</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border-white/5 space-y-3">
            {/* Level progression */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Structure Tier:</span>
              <span className="font-mono font-bold text-white flex items-center gap-2">
                <span>Tier {building.level}</span>
                <span className="text-purple-400">→</span>
                <span className="text-cyan-300">Tier {building.level + 1}</span>
              </span>
            </div>

            {/* Income or Population progression */}
            {isCommercial ? (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Base Revenue:</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <span>+${currentIncome.toFixed(1)}/s</span>
                    <span className="text-purple-400">→</span>
                    <span>+${nextIncome.toFixed(1)}/s</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Required Labor:</span>
                  <span className="font-mono text-slate-300 flex items-center gap-2">
                    <span>{currentReqPop} workers</span>
                    <span className="text-purple-400">→</span>
                    <span className="text-amber-300">{nextReqPop} workers</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Citizen Capacity:</span>
                <span className="font-mono font-bold text-blue-300 flex items-center gap-2">
                  <span>+{currentPop} Citizens</span>
                  <span className="text-purple-400">→</span>
                  <span>+{nextPop} Citizens</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Cost and Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <div className="text-[10px] uppercase text-slate-400 tracking-wider">
              Upgrade Cost
            </div>
            <div
              className={`text-base font-bold font-mono ${
                canAfford ? "text-amber-300" : "text-rose-400"
              }`}
            >
              {formatCurrency(upgradeCost)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white glass-card cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!canAfford || isActionPending}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2 cursor-pointer"
            >
              {isActionPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Modernizing...</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Upgrade Structure</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
