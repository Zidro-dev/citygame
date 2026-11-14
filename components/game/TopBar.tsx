"use client";

import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CityCalculationResult } from "@/lib/game-engine";
import { logoutAction } from "@/server-actions/auth";
import {
  Coins,
  Users,
  TrendingUp,
  Network,
  Trophy,
  RefreshCw,
  LogOut,
  Building2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface TopBarProps {
  username: string;
  balance: number;
  economy: CityCalculationResult;
  isActionPending: boolean;
  onSync: () => void;
  onOpenBridgeModal: () => void;
}

export function TopBar({
  username,
  balance,
  economy,
  isActionPending,
  onSync,
  onOpenBridgeModal,
}: TopBarProps) {
  const efficiencyPercent = Math.round(economy.efficiency * 100);
  const isDeficit = economy.efficiency < 1.0 && economy.totalRequiredPopulation > 0;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Mayor & Metropolis Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/city"
            className="flex items-center gap-2.5 group transition"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  {username}&apos;s Metropolis
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                  5x5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Metropolis Console</p>
            </div>
          </Link>
        </div>

        {/* Live Resource Meters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* 1. Live Treasury Balance */}
          <div className="glass-card px-3.5 py-1.5 rounded-xl border-amber-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Treasury
              </div>
              <div
                suppressHydrationWarning
                className="text-sm sm:text-base font-bold text-amber-300 font-mono tracking-tight"
              >
                {formatCurrency(balance)}
              </div>
            </div>
          </div>

          {/* 2. Population & Workforce */}
          <div className="glass-card px-3.5 py-1.5 rounded-xl border-blue-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.08)]">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span>Citizens</span>
                {isDeficit && (
                  <span title="Labor shortage: build more housing!">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-400 inline" />
                  </span>
                )}
              </div>
              <div
                suppressHydrationWarning
                className="text-sm sm:text-base font-bold text-blue-300 font-mono tracking-tight flex items-center gap-1.5"
              >
                <span>{formatNumber(economy.totalPopulation)}</span>
                <span className="text-[10px] font-normal text-slate-400">
                  / {economy.totalRequiredPopulation} req
                </span>
              </div>
            </div>
          </div>

          {/* 3. Live Income Per Second */}
          <div className="glass-card px-3.5 py-1.5 rounded-xl border-emerald-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Revenue
              </div>
              <div
                suppressHydrationWarning
                className="text-sm sm:text-base font-bold text-emerald-300 font-mono tracking-tight"
              >
                +{formatCurrency(economy.finalIncomePerSec)}/s
              </div>
            </div>
          </div>

          {/* 4. Efficiency Badge */}
          <div
            title={
              isDeficit
                ? `Commercial income reduced to ${efficiencyPercent}% due to worker shortage.`
                : "Workforce fully satisfied at 100%."
            }
            className={`hidden md:flex px-2.5 py-1.5 rounded-xl border text-xs font-mono items-center gap-1.5 ${
              isDeficit
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{efficiencyPercent}% Eff</span>
          </div>

          {/* 5. Tourism Bridges Badge & Button */}
          <button
            onClick={onOpenBridgeModal}
            title="Manage Tourism Bridges"
            className="glass-card-hover px-3 py-1.5 rounded-xl border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            <Network className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {economy.bridgeCount}/9 Bridges{" "}
              <span className="text-purple-200 font-bold">
                (+{Math.round((economy.bridgeMultiplier - 1) * 100)}%)
              </span>
            </span>
          </button>
        </div>

        {/* Global Navigation & Actions */}
        <div className="flex items-center gap-2">
          {/* Leaderboard Link */}
          <Link
            href="/leaderboard"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Global Rankings"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Rankings</span>
          </Link>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isActionPending}
            title="Sync Balance to Server"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 text-slate-400 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isActionPending ? "animate-spin text-cyan-400" : ""}`}
            />
          </button>

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              title="Logout Mayor"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 text-slate-400 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
