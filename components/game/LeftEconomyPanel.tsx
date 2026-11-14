"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
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
  Cpu,
  Layers,
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
    <aside className="w-full lg:w-84 rounded-3xl p-4 space-y-4 bg-slate-900/60 backdrop-blur-md border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.12),inset_0_0_12px_rgba(34,211,238,0.15)] flex flex-col justify-between max-h-[85vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">
                {t("economyAndTech")}
              </h2>
              <span className="text-[9px] font-mono text-cyan-400">Ishlab chiqarish &amp; R&amp;D</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-sm">
            TIER 3
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. Resurslar zanjiri (Resource Chain) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t("resourceChain")}</span>
          </div>

          {/* High-Contrast Flow Diagram: Xomashyo 📦 ➔ Zavod 🏭 ➔ Do'kon 🛒 */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 border border-white/10 shadow-inner flex items-center justify-between gap-1.5">
            {/* Step 1: Xomashyo 📦 (Amber gradient) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-600/20 border border-amber-400/40 text-amber-300 mb-1 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-amber-200 font-bold tracking-tight">
                {t("rawMaterial")}
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />

            {/* Step 2: Zavod 🏭 (Blue/Indigo gradient) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/20 border border-blue-400/40 text-blue-300 mb-1 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                <Factory className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-blue-200 font-bold tracking-tight">
                {t("factory")}
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />

            {/* Step 3: Do'kon 🛒 (Emerald/Green gradient) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-600/20 border border-emerald-400/40 text-emerald-300 mb-1 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-emerald-200 font-bold tracking-tight">
                {t("shop")}
              </span>
            </div>
          </div>

          {/* Active Chain Card: Tijorat do'koni - $800, 3-bosqich */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-purple-950/20 to-slate-900/90 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-600/20 border border-fuchsia-400/40 text-fuchsia-300 shrink-0 shadow-sm">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-white leading-tight">
                  Tijorat do&apos;koni - $800, 3-bosqich
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>({t("efficiency")}: {efficiencyPercent}%)</span>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              LV.3
            </span>
          </div>

          {/* City Specialization Card: Yashil shahar (Ixtisoslik) */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-lg">🏙️</span>
              </div>
              <div>
                <div className="text-xs font-black text-white leading-tight">
                  {t("greenCitySpec")}
                </div>
                <div className="text-[10px] text-emerald-300 font-bold">
                  ({t("specialization")})
                </div>
              </div>
            </div>
            {/* Bold Game-Grade "FAOL" Badge on Green Gradient */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              FAOL
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. Texnologiyalar Daraxti (Tech Tree) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2.5 pt-3 border-t border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{t("techTree")}</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono">{t("techTreeDesc")}</div>
            </div>
            <button
              onClick={() => setIsTechOpen(!isTechOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              {isTechOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isTechOpen && (
            <div className="space-y-2.5">
              {/* Flowchart Tree Nodes with high-contrast gradients */}
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-purple-500/25 shadow-inner">
                <div className="flex items-center justify-center gap-3">
                  {/* Node 1: Ilm-fan ochkolari */}
                  <button
                    onClick={() => onResearchTech("science_points", 150)}
                    disabled={hasSciencePoints}
                    className={`flex-1 p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${
                      hasSciencePoints
                        ? "bg-purple-500/25 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : science >= 150
                        ? "bg-slate-800/90 hover:border-purple-400 text-slate-200 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                        : "opacity-60 bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Atom className="w-4 h-4 text-purple-300" />
                    <span className="text-[10px] font-bold leading-tight">
                      {t("sciencePoints")}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-purple-300">
                      {hasSciencePoints ? "✓ OCHILGAN" : "150 Ochko"}
                    </span>
                  </button>

                  <div className="w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />

                  {/* Node 2: Zamonaviy davrga o'tish */}
                  <button
                    onClick={() => onResearchTech("modern_era", 300)}
                    disabled={hasModernEra}
                    className={`flex-1 p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${
                      hasModernEra
                        ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : science >= 300
                        ? "bg-slate-800/90 hover:border-cyan-400 text-slate-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        : "opacity-60 bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Rocket className="w-4 h-4 text-cyan-300" />
                    <span className="text-[10px] font-bold leading-tight">
                      {t("modernEra")}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-cyan-300">
                      {hasModernEra ? "✓ OCHILGAN" : "300 Ochko"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Research Lab Action Card: Ilmiy Laboratoriya - $1,500 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/30 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-blue-600/20 border border-cyan-400/40 text-cyan-300 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white leading-tight">
                      Ilmiy Laboratoriya - $1,500
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono font-bold mt-0.5">
                      (Ochko: +2/soniyada)
                    </div>
                  </div>
                </div>

                {onOpenBuildModalForType && (
                  <button
                    onClick={() => onOpenBuildModalForType("SCIENCE_LAB")}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.4)] shrink-0"
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
