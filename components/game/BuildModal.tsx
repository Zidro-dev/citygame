"use client";

import { useState } from "react";
import { BUILDING_CATALOG } from "@/lib/game-constants";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import {
  X,
  Hammer,
  Home,
  Building2,
  Store,
  ShoppingBag,
  Briefcase,
  Users,
  TrendingUp,
  Loader2,
  CheckCircle,
  Trees,
  FlaskConical,
  Gamepad2,
} from "lucide-react";

interface BuildModalProps {
  tileCoordinates: { x: number; y: number } | null;
  balance: number;
  isActionPending: boolean;
  onClose: () => void;
  onBuild: (type: string, x: number, y: number) => Promise<boolean>;
}

export function BuildModal({
  tileCoordinates,
  balance,
  isActionPending,
  onClose,
  onBuild,
}: BuildModalProps) {
  const { t, getBuildingInfo } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | "RESIDENTIAL" | "COMMERCIAL" | "SCIENCE" | "ENTERTAINMENT">("ALL");
  const [selectedType, setSelectedType] = useState<string | null>("RESIDENTIAL_SMALL");

  if (!tileCoordinates) return null;

  const buildingsList = Object.values(BUILDING_CATALOG).filter((b) => {
    if (filter === "ALL") return true;
    return b.category === filter;
  });

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="w-5 h-5 text-blue-400" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case "Store":
        return <Store className="w-5 h-5 text-emerald-400" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case "Trees":
        return <Trees className="w-5 h-5 text-emerald-400" />;
      case "FlaskConical":
        return <FlaskConical className="w-5 h-5 text-cyan-400" />;
      case "Gamepad2":
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleConstruct = async () => {
    if (!selectedType) return;
    const success = await onBuild(selectedType, tileCoordinates.x, tileCoordinates.y);
    if (success) {
      onClose();
    }
  };

  const selectedBuildingDef = selectedType ? BUILDING_CATALOG[selectedType] : null;
  const selectedInfo = selectedType ? getBuildingInfo(selectedType) : null;
  const canAfford = selectedBuildingDef ? balance >= selectedBuildingDef.baseCost : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-white/15 p-6 relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t("modalTitle")}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {t("modalSubtitle", { x: tileCoordinates.x, y: tileCoordinates.y })} • {t("treasury")}:{" "}
                <span className="text-amber-300 font-semibold">{formatCurrency(balance)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-4 pb-2 relative z-10">
          {(["ALL", "RESIDENTIAL", "COMMERCIAL", "SCIENCE", "ENTERTAINMENT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                filter === tab
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-white/5 text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              {tab === "ALL"
                ? t("tabAll")
                : tab === "RESIDENTIAL"
                ? t("tabResidential")
                : tab === "COMMERCIAL"
                ? t("tabCommercial")
                : tab === "SCIENCE"
                ? "Ilm-fan"
                : "Ko'ngilochar"}
            </button>
          ))}
        </div>

        {/* Blueprint Selection List */}
        <div className="overflow-y-auto space-y-2.5 py-3 pr-1 relative z-10">
          {buildingsList.map((item) => {
            const isSelected = selectedType === item.type;
            const affordable = balance >= item.baseCost;
            const itemInfo = getBuildingInfo(item.type);

            return (
              <div
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "glass-card border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                    {renderIcon(item.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{itemInfo.name}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                          item.category === "RESIDENTIAL"
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.category === "RESIDENTIAL" ? t("tabResidential") : t("tabCommercial")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{itemInfo.description}</p>

                    {/* Stats badges */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      {item.category === "RESIDENTIAL" ? (
                        <div className="flex items-center gap-1 text-blue-300 font-mono">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>+{item.basePopulation} {t("citizens")}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 text-emerald-300 font-mono">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span>+${item.baseIncome}{t("perSec")}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 font-mono">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t("req")}: {item.requiredPopulation}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Tag */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-bold font-mono ${
                      affordable ? "text-amber-300" : "text-rose-400"
                    }`}
                  >
                    {formatCurrency(item.baseCost)}
                  </div>
                  <div className="text-[10px] text-slate-400">{t("cost")}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div className="text-xs text-slate-400">
            {selectedInfo && (
              <span>
                <strong className="text-white">{selectedInfo.name}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white glass-card cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleConstruct}
              disabled={!selectedType || !canAfford || isActionPending}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer"
            >
              {isActionPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t("buildingProgress")}</span>
                </>
              ) : !canAfford ? (
                <span>{t("insufficientFunds")}</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t("constructButton", { cost: formatCurrency(selectedBuildingDef?.baseCost || 0) })}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
