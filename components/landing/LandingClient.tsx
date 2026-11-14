"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, Users, ArrowRight, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function LandingClient() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher in Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl text-center space-y-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t("badge")}</span>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight leading-none">
            {t("heroTitle1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              {t("heroTitle2")}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("heroDesc")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition shadow-[0_0_30px_rgba(6,182,212,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <span>{t("foundCharter")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-card hover:border-cyan-500/40 hover:text-white transition flex items-center gap-2 cursor-pointer"
          >
            <span>{t("mayorLogin")}</span>
          </Link>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
          <div className="glass-card p-5 rounded-2xl border-white/5 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t("feature1Title")}</h3>
            <p className="text-xs text-slate-400 leading-normal">{t("feature1Desc")}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-white/5 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t("feature2Title")}</h3>
            <p className="text-xs text-slate-400 leading-normal">{t("feature2Desc")}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border-white/5 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">{t("feature3Title")}</h3>
            <p className="text-xs text-slate-400 leading-normal">{t("feature3Desc")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
