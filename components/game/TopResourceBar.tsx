"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CityCalculationResult } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { logoutAction } from "@/server-actions/auth";
import Link from "next/link";
import {
  Coins,
  Users,
  Dna,
  ShieldCheck,
  Flame,
  RefreshCw,
  LogOut,
  Sparkles,
  TrendingUp,
  Menu,
} from "lucide-react";

interface TopResourceBarProps {
  balance: number;
  science: number;
  economy: CityCalculationResult;
  isActionPending: boolean;
  onSync: () => void;
  rank?: number;
  onOpenMobileMenu?: () => void;
}

export function TopResourceBar({
  balance,
  science,
  economy,
  isActionPending,
  onSync,
  rank = 12,
  onOpenMobileMenu,
}: TopResourceBarProps) {
  const { t, language } = useLanguage();
  const efficiencyPercent = Math.round(economy.efficiency * 100);

  return (
    <header className="w-full z-40 px-4 py-3 flex items-center justify-between gap-3 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* ------------------------------------------------------------- */}
      {/* Top Left: Bold Sci-Fi Branding "METROPOLIS" + Live System Status */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <Link
          href="/city"
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/60 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-300 transition-all duration-300 cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_#22d3ee]" />
          <div>
            <div className="font-black text-sm tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400">
              METROPOLIS
            </div>
            <div className="text-[9px] font-mono text-cyan-400/80 tracking-wider -mt-0.5">
              SCI-FI 10x10 CONSOLE
            </div>
          </div>
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Main 5 High-Fidelity Glow-Effect Resource Indicators */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full py-1 lg:flex-wrap lg:justify-center flex-1">
        {/* 1. Mablag' ($ / sek) - Rich Gold/Amber with green growth tag */}
        <div className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15),inset_0_0_10px_rgba(245,158,11,0.1)] flex items-center gap-2.5 backdrop-blur-md">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Coins className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider">
              {t("treasury")}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                suppressHydrationWarning
                className="text-sm font-black text-amber-200 font-mono tracking-tight"
              >
                {formatCurrency(balance)}
              </span>
              <span
                suppressHydrationWarning
                className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.2 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-0.5"
              >
                <TrendingUp className="w-2.5 h-2.5 inline" />
                +{Math.round(economy.finalIncomePerSec)}$/sek
              </span>
            </div>
          </div>
        </div>

        {/* 2. Aholi (Ishchi kuchi: %) - Vivid Blue with Mini Progress Bar */}
        <div className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_0_10px_rgba(59,130,246,0.1)] flex items-center gap-2.5 backdrop-blur-md">
          <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Users className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-blue-300/80 tracking-wider gap-2">
              <span>{t("population")}</span>
              <span className="text-[9px] font-mono text-cyan-300 lowercase">
                {efficiencyPercent}% ishchi
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                suppressHydrationWarning
                className="text-sm font-black text-blue-200 font-mono tracking-tight"
              >
                {formatNumber(economy.totalPopulation)} {language === "uz" ? "ta" : ""}
              </span>
            </div>
            {/* Tiny workforce progress bar */}
            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden mt-1 border border-blue-500/30">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${Math.min(100, efficiencyPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Ilm-fan (Science) - Glowing Purple/Magenta */}
        <div className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15),inset_0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-2.5 backdrop-blur-md">
          <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Dna className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
              {t("science")}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                suppressHydrationWarning
                className="text-sm font-black text-purple-200 font-mono tracking-tight"
              >
                {formatNumber(science)} {language === "uz" ? "ta" : ""}
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-semibold">
                +{economy.sciencePerSec > 0 ? economy.sciencePerSec : 1}/s
              </span>
            </div>
          </div>
        </div>

        {/* 4. Ekologiya / Baxt (Ecology / Happiness) - Vibrant Leaf Green */}
        <div className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15),inset_0_0_10px_rgba(16,185,129,0.1)] flex items-center gap-2.5 backdrop-blur-md">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-300/80 tracking-wider">
              {t("ecology")}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                suppressHydrationWarning
                className="text-sm font-black text-emerald-300 font-mono tracking-tight"
              >
                {economy.happiness}%
              </span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                Yashil
              </span>
            </div>
          </div>
        </div>

        {/* 5. Reyting (Leaderboard Rank) - Fiery Amber / Red Star Badge */}
        <Link
          href="/leaderboard"
          className="shrink-0 group px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/90 border border-orange-500/40 hover:border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15),inset_0_0_10px_rgba(249,115,22,0.1)] flex items-center gap-2.5 backdrop-blur-md transition-all duration-300 cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-105 transition">
            <Flame className="w-4 h-4 text-amber-200 fill-amber-300" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-300/80 tracking-wider">
              {t("ranking")}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-amber-300 font-mono tracking-tight">
                #{rank}
              </span>
              <span className="text-[9px] font-mono text-orange-400 group-hover:text-amber-200">
                Top &rarr;
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Right Controls: Language Switcher, Sync Indicator, Logout */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <button
          onClick={onSync}
          disabled={isActionPending}
          title={t("syncTooltip")}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/30 text-slate-300 transition cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isActionPending ? "animate-spin text-cyan-400" : ""}`}
          />
        </button>

        <form action={logoutAction} className="hidden sm:block">
          <button
            type="submit"
            title={t("logoutTooltip")}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 hover:text-rose-300 border border-rose-500/30 text-slate-400 transition cursor-pointer active:scale-95 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>

        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/30 text-slate-300 transition cursor-pointer active:scale-95 shadow-sm"
            title="Menyu"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>
        )}
      </div>
    </header>
  );
}
