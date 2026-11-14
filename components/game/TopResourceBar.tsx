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
  Trees,
  Flame,
  RefreshCw,
  LogOut,
  Trophy,
} from "lucide-react";

interface TopResourceBarProps {
  balance: number;
  science: number;
  economy: CityCalculationResult;
  isActionPending: boolean;
  onSync: () => void;
  rank?: number;
}

export function TopResourceBar({
  balance,
  science,
  economy,
  isActionPending,
  onSync,
  rank = 12,
}: TopResourceBarProps) {
  const { t, language } = useLanguage();
  const efficiencyPercent = Math.round(economy.efficiency * 100);

  return (
    <header className="w-full z-40 px-3 py-2.5 flex items-center justify-between gap-2 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      {/* City Title or Brand */}
      <div className="flex items-center gap-2">
        <Link
          href="/city"
          className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400/50 transition cursor-pointer"
        >
          <span className="font-black text-sm tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            METROPOLIS
          </span>
        </Link>
      </div>

      {/* 5 Main Pill Resource Meters matching the exact screenshot */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 flex-1">
        {/* 1. Mablag' ($ / sek) */}
        <div className="glass-card px-3.5 py-1.5 rounded-2xl border-white/10 bg-slate-900/80 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="p-1 rounded-lg bg-amber-500/15 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400">{t("treasury")}:</span>
            <span
              suppressHydrationWarning
              className="font-bold text-white font-mono"
            >
              {formatCurrency(balance)}
            </span>
            <span
              suppressHydrationWarning
              className="text-[11px] font-mono text-emerald-400 font-semibold"
            >
              (+{Math.round(economy.finalIncomePerSec)}$/sek)
            </span>
          </div>
        </div>

        {/* 2. Aholi (Ishchi kuchi: %) */}
        <div className="glass-card px-3.5 py-1.5 rounded-2xl border-white/10 bg-slate-900/80 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400">{t("population")}:</span>
            <span
              suppressHydrationWarning
              className="font-bold text-white font-mono"
            >
              {formatNumber(economy.totalPopulation)} {language === "uz" ? "ta" : ""}
            </span>
            <span
              suppressHydrationWarning
              className="text-[11px] font-mono text-slate-400"
            >
              ({t("laborForce")}: {efficiencyPercent}%)
            </span>
          </div>
        </div>

        {/* 3. Ilm-fan (Science) */}
        <div className="glass-card px-3.5 py-1.5 rounded-2xl border-purple-500/20 bg-slate-900/80 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <div className="p-1 rounded-lg bg-purple-500/15 text-purple-400">
            <Dna className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400">{t("science")}:</span>
            <span
              suppressHydrationWarning
              className="font-bold text-purple-300 font-mono"
            >
              {formatNumber(science)} {language === "uz" ? "ta" : ""}
            </span>
          </div>
        </div>

        {/* 4. Ekologiya / Baxt (Ecology / Happiness) */}
        <div className="glass-card px-3.5 py-1.5 rounded-2xl border-emerald-500/20 bg-slate-900/80 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Trees className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400">{t("ecology")}:</span>
            <span
              suppressHydrationWarning
              className="font-bold text-emerald-300 font-mono"
            >
              {economy.happiness}%
            </span>
          </div>
        </div>

        {/* 5. Reyting (Leaderboard Rank) */}
        <Link
          href="/leaderboard"
          className="glass-card px-3.5 py-1.5 rounded-2xl border-orange-500/20 bg-slate-900/80 hover:border-orange-400/50 flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.1)] transition cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-orange-500/15 text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-400">{t("ranking")}:</span>
            <span className="font-bold text-amber-300 font-mono">
              #{rank}
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls: Language Switcher, Sync, Rankings, Logout */}
      <div className="flex items-center gap-1.5">
        <LanguageSwitcher />

        <button
          onClick={onSync}
          disabled={isActionPending}
          title={t("syncTooltip")}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/5 text-slate-400 transition cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isActionPending ? "animate-spin text-cyan-400" : ""}`}
          />
        </button>

        <form action={logoutAction}>
          <button
            type="submit"
            title={t("logoutTooltip")}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 border border-white/5 text-slate-400 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </header>
  );
}
