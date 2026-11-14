"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/server-actions/leaderboard";
import {
  Trophy,
  ArrowLeft,
  TrendingUp,
  Users,
  Medal,
} from "lucide-react";

interface LeaderboardClientProps {
  topEarners: LeaderboardEntry[];
  topMegapolises: LeaderboardEntry[];
  currentUsername?: string;
}

export function LeaderboardClient({
  topEarners,
  topMegapolises,
  currentUsername,
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<"EARNERS" | "MEGAPOLISES">("EARNERS");

  const list = activeTab === "EARNERS" ? topEarners : topMegapolises;

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1 text-amber-300 font-bold font-mono">
          <Medal className="w-4 h-4 text-amber-400" />
          <span>#1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-1 text-slate-300 font-bold font-mono">
          <Medal className="w-4 h-4 text-slate-300" />
          <span>#2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-1 text-amber-600 font-bold font-mono">
          <Medal className="w-4 h-4 text-amber-600" />
          <span>#3</span>
        </div>
      );
    }
    return <span className="text-slate-400 font-mono text-xs">#{rank}</span>;
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/city"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/30 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Return to City Console</span>
        </Link>

        <div className="text-xs text-slate-400 font-mono">Global Leaderboards</div>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Metropolis Global Hall of Fame
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Real-time rankings of the wealthiest economic titans and most populous urban civilizations
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab("EARNERS")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "EARNERS"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : "glass-card text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Top Earners ($/sec)</span>
          </button>

          <button
            onClick={() => setActiveTab("MEGAPOLISES")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "MEGAPOLISES"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                : "glass-card text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Megapolises (Population)</span>
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto relative z-10 pt-2">
          {list.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 glass-card rounded-2xl">
              No cities registered yet. Be the first to establish a metropolis!
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Mayor</th>
                  <th className="py-3 px-3 text-right">
                    {activeTab === "EARNERS" ? "Revenue Rate" : "Citizens"}
                  </th>
                  <th className="py-3 px-3 text-right hidden sm:table-cell">
                    {activeTab === "EARNERS" ? "Citizens" : "Revenue Rate"}
                  </th>
                  <th className="py-3 px-3 text-right hidden md:table-cell">Structures</th>
                  <th className="py-3 px-3 text-right hidden md:table-cell">Bridges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {list.map((entry) => {
                  const isCurrentUser =
                    currentUsername &&
                    entry.username.toLowerCase() === currentUsername.toLowerCase();

                  return (
                    <tr
                      key={entry.username}
                      className={`transition ${
                        isCurrentUser
                          ? "bg-cyan-500/10 font-bold text-white border-l-2 border-cyan-400"
                          : "hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      <td className="py-3 px-3">{renderRankBadge(entry.rank)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{entry.username}</span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {activeTab === "EARNERS" ? (
                          <span className="text-emerald-400">
                            +{formatCurrency(entry.incomePerSec)}/s
                          </span>
                        ) : (
                          <span className="text-blue-300">
                            {formatNumber(entry.population)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400 hidden sm:table-cell">
                        {activeTab === "EARNERS" ? (
                          <span>{formatNumber(entry.population)} Citizens</span>
                        ) : (
                          <span className="text-emerald-400/80">
                            +{formatCurrency(entry.incomePerSec)}/s
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400 hidden md:table-cell">
                        {entry.buildingCount} / 25
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-purple-300 hidden md:table-cell">
                        {entry.bridgeCount} / 9
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
