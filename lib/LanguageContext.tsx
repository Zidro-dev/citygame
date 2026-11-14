"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  translations,
  type Language,
  type BuildingTranslation,
} from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getBuildingInfo: (type: string) => BuildingTranslation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");

  // Read saved language from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("citygame_lang");
      if (saved === "uz" || saved === "en") {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("citygame_lang", lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    const next = language === "uz" ? "en" : "uz";
    setLanguage(next);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[language] as Record<string, unknown>;
    const rawVal = dict[key] ?? (translations.en as Record<string, unknown>)[key] ?? key;
    let text = typeof rawVal === "string" ? rawVal : String(key);

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
      });
    }

    return text;
  };

  const getBuildingInfo = (type: string): BuildingTranslation => {
    const dict = translations[language]?.buildings?.[type];
    if (dict) return dict;
    const fallback = translations.en?.buildings?.[type];
    if (fallback) return fallback;
    return { name: type, description: "" };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getBuildingInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
