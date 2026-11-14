"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Users,
  Network,
  Sparkles,
  Trophy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  PartyPopper,
  Medal,
} from "lucide-react";

interface RightPartnersPanelProps {
  bridgesCount: number;
  onOpenBridgeModal: () => void;
  onOpenMiniGame: () => void;
  boostMultiplier: number;
  boostSecondsLeft: number;
  currentUsername: string;
}

export function RightPartnersPanel({
  bridgesCount,
  onOpenBridgeModal,
  onOpenMiniGame,
  boostMultiplier,
  boostSecondsLeft,
  currentUsername,
}: RightPartnersPanelProps) {
  const { t } = useLanguage();
  const [isPartnershipExpanded, setIsPartnershipExpanded] = useState(true);

  // Sample or live leaders list matching the screenshot
  const leaders = [
    { rank: 1, name: "Gayin240", score: "1,520" },
    { rank: 2, name: "Samar_00", score: "1,130" },
    { rank: 3, name: currentUsername || "Siz", score: "890" },
  ];

  return (
    <aside className="w-full lg:w-76 glass-panel rounded-3xl border border-white/10 p-4 space-y-3.5 bg-slate-950/75 backdrop-blur-xl shadow-2xl flex flex-col justify-between max-h-[85vh] overflow-y-auto">
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" />
            <span>{t("partners")}</span>
          </h2>
          <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30">
            {bridgesCount}/9 Ko&apos;prik
          </span>
        </div>

        {/* 1. O'yin takliflar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            <span>{t("gameInvites")}</span>
            <button
              onClick={onOpenBridgeModal}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold transition cursor-pointer"
            >
              {t("invite")}
            </button>
          </div>

          <div
            onClick={onOpenBridgeModal}
            className="glass-card p-2.5 rounded-xl border-white/5 hover:border-cyan-500/30 transition flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>@Ali - san&apos;atlar</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* 2. Faol hamkorliklar */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {t("activePartnerships")}
          </div>

          <div className="glass-card rounded-2xl border-purple-500/20 overflow-hidden bg-slate-900/60">
            <div
              onClick={() => setIsPartnershipExpanded(!isPartnershipExpanded)}
              className="p-2.5 flex items-center justify-between cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2 text-white font-medium">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>@Samar - IT Hab</span>
              </div>
              {isPartnershipExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>

            {isPartnershipExpanded && (
              <div className="px-2.5 pb-2.5 pt-0">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-200">
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>+15% Hamkorlik Bonusi</span>
                  </div>
                  <div className="text-slate-400 mt-0.5">(Sanoat-Yashil hamkorligi)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Noyob ko'priklar */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {t("uniqueBridges")}
          </div>
          <div className="space-y-1 text-xs">
            <div className="p-2 rounded-xl glass-card border-white/5 flex items-center justify-between text-slate-400">
              <span>@Ali - aonaiflar</span>
              <span className="text-[10px] font-mono text-cyan-300">Faol</span>
            </div>
            <div className="p-2 rounded-xl glass-card border-white/5 flex items-center justify-between text-slate-400">
              <span>@Samar - IT Hab</span>
              <span className="text-[10px] font-mono text-cyan-300">Faol</span>
            </div>
          </div>
        </div>

        {/* 4. Kutilmagan voqea (Dinamik Event) */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 space-y-1 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("dynamicEvent")}</span>
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>🎪</span>
            <span>Festival boshlandi!</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-semibold">
            (+20% Aholi baxti)
          </div>
        </div>

        {/* 5. Mini-o'yin (2x Boost) */}
        <div>
          <button
            onClick={onOpenMiniGame}
            className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95 ${
              boostMultiplier > 1
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 animate-pulse"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>
              {boostMultiplier > 1
                ? `⚡ 2x Boost Faol! (${boostSecondsLeft}s)`
                : `🧩 ${t("winBoost")}`}
            </span>
          </button>
        </div>

        {/* 6. Top O'yinchilar (Reytinglar) */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("topPlayers")}</span>
          </div>

          <div className="glass-card rounded-2xl border-white/5 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[9px] text-slate-400 uppercase">
                  <th className="py-1.5 px-2">Rank</th>
                  <th className="py-1.5 px-2">Name</th>
                  <th className="py-1.5 px-2 text-right">Reyting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaders.map((lead) => (
                  <tr key={lead.rank} className="hover:bg-white/5 text-[11px]">
                    <td className="py-1 px-2 font-mono">
                      {lead.rank === 1 ? "🥇" : lead.rank === 2 ? "🥈" : "🥉"} {lead.rank}
                    </td>
                    <td className="py-1 px-2 font-medium text-white truncate max-w-[80px]">
                      {lead.name}
                    </td>
                    <td className="py-1 px-2 text-right font-mono text-amber-300 font-bold">
                      {lead.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </aside>
  );
}
