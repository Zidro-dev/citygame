"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={language === "uz" ? "Switch to English" : "O'zbek tiliga o'tish"}
      className={`glass-card hover:border-cyan-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-cyan-400" />
      <span className="font-mono uppercase tracking-wider">
        {language === "uz" ? "🇺🇿 UZ" : "🇬🇧 EN"}
      </span>
    </button>
  );
}
