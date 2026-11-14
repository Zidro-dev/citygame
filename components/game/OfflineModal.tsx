"use client";

import type { OfflineReport } from "@/hooks/useCityEngine";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import { Coins, Clock, Sparkles, ShieldAlert } from "lucide-react";

interface OfflineModalProps {
  report: OfflineReport | null;
  onClaim: () => void;
}

export function OfflineModal({ report, onClaim }: OfflineModalProps) {
  const { t, language } = useLanguage();

  if (!report) return null;

  const formatElapsed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    const hUnit = language === "uz" ? "s" : "h";
    const mUnit = language === "uz" ? "d" : "m";
    const sUnit = language === "uz" ? "son" : "s";

    if (hours > 0) parts.push(`${hours}${hUnit}`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}${mUnit}`);
    parts.push(`${secs}${sUnit}`);
    return parts.join(" ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/20 p-6 relative overflow-hidden shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Badge */}
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
          <Coins className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t("offlineTitle")}
          </h2>
          <p className="text-xs text-slate-400">
            {t("offlineDesc")}
          </p>
        </div>

        {/* Earnings Card */}
        <div className="glass-card p-4 rounded-2xl border-white/10 space-y-3">
          <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">
            +{formatCurrency(report.earned)}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t("timeAccumulated", { time: formatElapsed(report.elapsedSeconds) })}</span>
          </div>

          {report.wasCapped && (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{t("cappedWarning")}</span>
            </div>
          )}
        </div>

        {/* Claim Button */}
        <button
          onClick={onClaim}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-[0.99] transition shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t("claimButton")}</span>
        </button>
      </div>
    </div>
  );
}
