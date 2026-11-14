"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Factory,
  Store,
  ArrowRight,
  Sparkles,
  Atom,
  Rocket,
  FlaskConical,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LeftEconomyPanelProps {
  balance: number;
  science: number;
  efficiencyPercent: number;
  researchedNodes: string[];
  onResearchTech: (nodeId: string, cost: number) => boolean;
  onOpenBuildModalForType?: (type: string) => void;
}

export function LeftEconomyPanel({
  balance,
  science,
  efficiencyPercent,
  researchedNodes,
  onResearchTech,
  onOpenBuildModalForType,
}: LeftEconomyPanelProps) {
  const { t } = useLanguage();
  const [isTechOpen, setIsTechOpen] = useState(true);

  const hasModernEra = researchedNodes.includes("modern_era");
  const hasSciencePoints = researchedNodes.includes("science_points");

  return (
    <aside className="w-full lg:w-80 glass-panel rounded-3xl border border-white/10 p-4 space-y-4 bg-slate-950/75 backdrop-blur-xl shadow-2xl flex flex-col justify-between max-h-[85vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{t("economyAndTech")}</span>
          </h2>
        </div>

        {/* 1. Resurslar zanjiri (Resource Chain) */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {t("resourceChain")}
          </div>

          {/* Flow Diagram: Xomashyo ➔ Zavod ➔ Do'kon */}
          <div className="glass-card p-2.5 rounded-2xl border-white/5 flex items-center justify-between text-center gap-1 bg-slate-900/60">
            {/* Step 1: Xomashyo */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1 shadow-sm">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium">{t("rawMaterial")}</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            {/* Step 2: Zavod */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-1 shadow-sm">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium">{t("factory")}</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            {/* Step 3: Do'kon */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1 shadow-sm">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium">{t("shop")}</span>
            </div>
          </div>

          {/* Active Chain Card: Tijorat do'koni */}
          <div className="glass-card p-3 rounded-2xl border-white/10 hover:border-cyan-500/30 transition flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">
                  Tijorat do&apos;koni - $800, 3-bosqich
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  ({t("efficiency")}: {efficiencyPercent}%)
                </div>
              </div>
            </div>
          </div>

          {/* City Specialization Card: Yashil shahar */}
          <div className="glass-card p-3 rounded-2xl border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 to-slate-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 overflow-hidden flex items-center justify-center shrink-0">
                <span className="text-base">🏙️</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">
                  {t("greenCitySpec")}
                </div>
                <div className="text-[10px] text-emerald-300 font-medium">
                  ({t("specialization")})
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              FAOL
            </span>
          </div>
        </div>

        {/* 2. Texnologiyalar Daraxti (Tech Tree) */}
        <div className="space-y-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                {t("techTree")}
              </div>
              <div className="text-[10px] text-slate-400">{t("techTreeDesc")}</div>
            </div>
            <button
              onClick={() => setIsTechOpen(!isTechOpen)}
              className="p-1 text-slate-400 hover:text-white"
            >
              {isTechOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isTechOpen && (
            <div className="space-y-2">
              {/* Flowchart Tree Nodes */}
              <div className="p-3 rounded-2xl glass-card border-white/5 bg-slate-900/60 relative">
                {/* Flow lines connector */}
                <div className="flex items-center justify-center gap-3">
                  {/* Node 1: Ilm-fan ochkolari */}
                  <button
                    onClick={() => onResearchTech("science_points", 150)}
                    disabled={hasSciencePoints}
                    className={`flex-1 p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      hasSciencePoints
                        ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                        : science >= 150
                        ? "bg-slate-800/80 hover:border-purple-400/50 text-slate-300"
                        : "opacity-60 bg-slate-900/40 text-slate-500"
                    }`}
                  >
                    <Atom className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-semibold leading-tight">
                      {t("sciencePoints")}
                    </span>
                    <span className="text-[9px] font-mono text-purple-200">
                      {hasSciencePoints ? "✓ Faol" : "150 ochko"}
                    </span>
                  </button>

                  <div className="w-4 h-[1px] bg-purple-500/40" />

                  {/* Node 2: Zamonaviy davrga o'tish */}
                  <button
                    onClick={() => onResearchTech("modern_era", 300)}
                    disabled={hasModernEra}
                    className={`flex-1 p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      hasModernEra
                        ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        : science >= 300
                        ? "bg-slate-800/80 hover:border-cyan-400/50 text-slate-300"
                        : "opacity-60 bg-slate-900/40 text-slate-500"
                    }`}
                  >
                    <Rocket className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-semibold leading-tight">
                      {t("modernEra")}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-200">
                      {hasModernEra ? "✓ Faol" : "300 ochko"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Research Lab Card: Ilmiy Laboratoriya */}
              <div className="glass-card p-3 rounded-2xl border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-slate-900/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      Ilmiy Laboratoriya - $1,500
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                      (Ochko: +2/soniyada)
                    </div>
                  </div>
                </div>

                {onOpenBuildModalForType && (
                  <button
                    onClick={() => onOpenBuildModalForType("SCIENCE_LAB")}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold cursor-pointer transition shrink-0"
                  >
                    Qurish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
