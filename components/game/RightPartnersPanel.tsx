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
  AlertTriangle,
  Zap,
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

  // Leaderboard entries matching the screenshot
  const leaders = [
    { rank: 1, name: "Gayin240", score: "1,520", medal: "🥇" },
    { rank: 2, name: "Samar_00", score: "1,130", medal: "🥈" },
    { rank: 3, name: currentUsername || "Siz", score: "890", medal: "🥉" },
  ];

  return (
    <aside className="w-full lg:w-80 rounded-3xl p-4 space-y-4 bg-slate-900/60 backdrop-blur-md border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.12),inset_0_0_12px_rgba(34,211,238,0.15)] flex flex-col justify-between max-h-[85vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">
                {t("partners")}
              </h2>
              <span className="text-[9px] font-mono text-purple-400">({bridgesCount}/9 Ko&apos;prik)</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/20 border border-purple-400/40 text-purple-300">
            ALLIANCE
          </span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. O'yin takliflar (Invites) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <span>{t("gameInvites")}</span>
            <button
              onClick={onOpenBridgeModal}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-[10px] uppercase tracking-wider transition shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95"
            >
              {t("invite")}
            </button>
          </div>

          <div
            onClick={onOpenBridgeModal}
            className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-cyan-500/20 hover:border-cyan-400/50 shadow-sm transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                A
              </div>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                  @Ali - san&apos;atlar
                </span>
                <span className="block text-[9px] font-mono text-slate-400">Turizm taklifi</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. Faol hamkorliklar (Active Partnerships) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {t("activePartnerships")}
          </div>

          <div className="rounded-2xl border border-purple-500/30 overflow-hidden bg-gradient-to-br from-slate-900/95 to-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <div
              onClick={() => setIsPartnershipExpanded(!isPartnershipExpanded)}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-500/25 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-purple-300">
                  S
                </div>
                <div>
                  <span className="text-xs font-bold text-white">@Samar - IT Hab</span>
                  <span className="block text-[9px] font-mono text-emerald-400 font-bold">Faol Ko&apos;prik</span>
                </div>
              </div>
              {isPartnershipExpanded ? (
                <ChevronUp className="w-4 h-4 text-purple-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-purple-400" />
              )}
            </div>

            {isPartnershipExpanded && (
              <div className="px-3 pb-3 pt-0">
                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 text-[10px]">
                  <div className="font-black text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+15% Hamkorlik Bonusi</span>
                  </div>
                  <div className="text-slate-300 font-medium mt-0.5">
                    (Sanoat-Yashil hamkorligi)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. Noyob ko'priklar (Unique Bridges) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {t("uniqueBridges")}
          </div>
          <div className="space-y-1.5">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">@Ali - aonaiflar</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                FAOL
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">@Samar - IT Hab</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                FAOL
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. Kutilmagan Voqea (Dinamik Event) - Pulsing Hazard Card */}
        {/* ------------------------------------------------------------- */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-red-600/20 to-orange-500/10 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)] space-y-1.5 animate-pulse">
          <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{t("dynamicEvent")}</span>
          </div>
          <div className="text-xs font-black text-white flex items-center gap-2">
            <span className="text-base">🎪</span>
            <span>Festival boshlandi!</span>
          </div>
          <div className="text-xs font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            (+20% Aholi baxti)
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. Arcade 2x Boost Yutish Button (Neon-Glowing Cyber-Green) */}
        {/* ------------------------------------------------------------- */}
        <div>
          <button
            onClick={onOpenMiniGame}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg active:scale-95 ${
              boostMultiplier > 1
                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 border border-emerald-400 hover:brightness-125 hover:shadow-[0_0_20px_#10b981] text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-slate-950" />
            <span>
              {boostMultiplier > 1
                ? `⚡ 2x BOOST FAOL (${boostSecondsLeft}s)`
                : `🧩 ${t("winBoost")}`}
            </span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 6. Top O'yinchilar (Reytinglar) - Structured Cards */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2 pt-2 border-t border-cyan-500/20">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("topPlayers")}</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/80 overflow-hidden text-xs shadow-inner">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[9px] text-slate-400 uppercase tracking-wider bg-white/5">
                  <th className="py-2 px-3">Rank</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3 text-right">Reyting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaders.map((lead) => (
                  <tr key={lead.rank} className="hover:bg-white/5 transition text-[11px]">
                    <td className="py-2 px-3 font-mono font-bold">
                      <span className="mr-1">{lead.medal}</span>
                      <span
                        className={
                          lead.rank === 1
                            ? "text-amber-300"
                            : lead.rank === 2
                            ? "text-slate-300"
                            : "text-amber-500"
                        }
                      >
                        #{lead.rank}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-white truncate max-w-[85px]">
                      {lead.name}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-amber-300">
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
