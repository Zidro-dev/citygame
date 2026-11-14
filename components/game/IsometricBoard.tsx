"use client";

import { useState } from "react";
import { GRID_SIZE, BUILDING_CATALOG } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Plus,
  Home,
  Building2,
  Store,
  ShoppingBag,
  Briefcase,
  Trees,
  FlaskConical,
  Gamepad2,
  Users,
  Sparkles,
  Zap,
} from "lucide-react";

interface IsometricBoardProps {
  buildings: BuildingState[];
  onSelectEmptyTile: (x: number, y: number) => void;
  onSelectBuilding: (building: BuildingState) => void;
}

export function IsometricBoard({
  buildings,
  onSelectEmptyTile,
  onSelectBuilding,
}: IsometricBoardProps) {
  const { t, getBuildingInfo } = useLanguage();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  // Map buildings by coordinates "x,y"
  const buildingMap = new Map<string, BuildingState>();
  for (const b of buildings) {
    buildingMap.set(`${b.grid_x},${b.grid_y}`, b);
  }

  // Helper for custom 3D building rendering
  const renderBuilding3D = (building: BuildingState) => {
    const def = BUILDING_CATALOG[building.type];
    if (!def) return null;
    const info = getBuildingInfo(building.type);

    // Differentiate visual 3D model based on building type
    const isGreenRes = building.type === "GREEN_RESIDENTIAL" || building.type === "RESIDENTIAL_SMALL";
    const isCommercial = def.category === "COMMERCIAL" || building.type === "COMMERCIAL_SHOP" || building.type === "COMMERCIAL_MALL";
    const isScience = building.type === "SCIENCE_LAB";
    const isEntertainment = building.type === "ENTERTAINMENT_CENTER";

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto">
        {/* Floating Label / Badge above building */}
        <div className="absolute -top-12 z-30 flex flex-col items-center pointer-events-none whitespace-nowrap animate-bounce-subtle">
          <div className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center gap-1.5">
            <span>{info.name}</span>
            <span className="text-[9px] font-mono text-cyan-300 px-1 py-0.2 rounded bg-cyan-500/20">
              L{building.level}
            </span>
          </div>

          {/* Sub badge if Green Housing */}
          {isGreenRes && (
            <div className="mt-0.5 px-1.5 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-300 font-mono flex items-center gap-1">
              <span>👥 401</span>
              <span>👤 99</span>
            </div>
          )}

          {/* Arrow pointer */}
          <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-cyan-400/50 rotate-45 -mt-0.5" />
        </div>

        {/* 3D Isometric Isometric Block representation */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-200 group-hover:scale-105">
          {/* Base shadow */}
          <div className="absolute inset-0 bg-black/60 rounded-xl blur-md -bottom-2" />

          {/* Green Housing 3D Model */}
          {isGreenRes && (
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-emerald-800 via-emerald-600 to-teal-500 border border-emerald-400/60 p-1.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex flex-col justify-between overflow-hidden">
              {/* Roof Garden & Foliage */}
              <div className="flex items-center justify-between text-emerald-200">
                <Trees className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span className="text-[8px] font-mono font-bold bg-emerald-950/60 px-1 rounded text-emerald-200">
                  ECO
                </span>
              </div>
              {/* Windows Grid */}
              <div className="grid grid-cols-3 gap-1 my-auto px-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-2 rounded bg-yellow-200/80 shadow-[0_0_4px_rgba(254,240,138,0.8)]" />
                ))}
              </div>
              <div className="text-[9px] font-bold text-center text-white truncate">
                Yashil Uylar
              </div>
            </div>
          )}

          {/* Commercial / Factory 3D Model */}
          {isCommercial && (
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-purple-900 via-indigo-700 to-pink-600 border border-pink-400/60 p-1.5 shadow-[0_0_25px_rgba(236,72,153,0.4)] flex flex-col justify-between overflow-hidden">
              {/* Neon Sign */}
              <div className="text-center font-black tracking-widest text-[8px] text-pink-300 uppercase bg-black/50 rounded py-0.5 border border-pink-500/40">
                TIJORAT
              </div>
              {/* Neon Windows */}
              <div className="grid grid-cols-2 gap-1 my-auto">
                <div className="h-3 rounded bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="h-3 rounded bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
              </div>
              <div className="flex items-center justify-between text-[9px] text-amber-300 font-mono font-bold">
                <Store className="w-3.5 h-3.5" />
                <span>+${(def.baseIncome * Math.pow(1.4, building.level - 1)).toFixed(0)}/s</span>
              </div>
            </div>
          )}

          {/* Science Laboratory 3D Model */}
          {isScience && (
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-slate-900 via-blue-900 to-cyan-500 border border-cyan-300/80 p-1.5 shadow-[0_0_25px_rgba(6,182,212,0.6)] flex flex-col justify-between overflow-hidden">
              {/* Holographic energy reactor */}
              <div className="mx-auto w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-300 flex items-center justify-center animate-spin-slow">
                <FlaskConical className="w-3 h-3 text-cyan-200" />
              </div>
              <div className="text-center text-[8px] font-mono text-cyan-200 font-bold bg-black/40 rounded py-0.5">
                LAB ⚛️
              </div>
              <div className="text-[9px] font-mono font-bold text-center text-cyan-300">
                +2 Ilm-fan
              </div>
            </div>
          )}

          {/* Entertainment Center 3D Model */}
          {isEntertainment && (
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-fuchsia-950 via-purple-800 to-amber-500 border border-amber-400/80 p-1.5 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex flex-col justify-between overflow-hidden">
              <div className="text-center font-black text-[7px] text-amber-200 tracking-wider bg-black/60 rounded py-0.5 border border-amber-500/40">
                KO&apos;NGILOCHAR
              </div>
              <div className="mx-auto text-amber-300 my-auto">
                <Gamepad2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-[8px] font-bold text-center text-white">
                Mini-o&apos;yinlar
              </div>
            </div>
          )}

          {/* Fallback building model */}
          {!isGreenRes && !isCommercial && !isScience && !isEntertainment && (
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-t from-slate-800 to-indigo-600 border border-white/20 p-1.5 flex flex-col justify-between">
              <Building2 className="w-5 h-5 text-slate-200 mx-auto" />
              <div className="text-[8px] font-bold text-center text-white truncate">
                {info.name}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full flex-1 flex items-center justify-center min-h-[580px] p-2 overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. BRIDGES EXTENDING OUT (Matching the 4 corners in screenshot) */}
      {/* ------------------------------------------------------------- */}

      {/* Top-Left Bridge: @Ali - Yashil shahar */}
      <div className="absolute top-4 left-6 z-20 flex flex-col items-center pointer-events-auto">
        <div className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          @Ali - Yashil shahar
        </div>
        {/* Bridge span graphic */}
        <div className="w-28 h-6 border-b-2 border-dashed border-cyan-400/50 relative flex items-center justify-center">
          <div className="w-full h-1 bg-cyan-500/20" />
          <div className="absolute w-2 h-1 bg-cyan-300 rounded-full animate-traffic-forward" />
        </div>
      </div>

      {/* Top-Right Bridge: @Samar - IT Hab with +15% Hamkorlik Bonusi */}
      <div className="absolute top-4 right-6 z-20 flex flex-col items-center pointer-events-auto">
        <div className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-purple-500/40 text-[11px] font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          @Samar - IT Hab
        </div>
        <div className="mt-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
          +15% Hamkorlik Bonusi
          <span className="block text-[8px] font-normal text-slate-400">
            (Sanoat-Yashil hamkorligi)
          </span>
        </div>
        <div className="w-28 h-6 border-b-2 border-dashed border-purple-400/50 relative flex items-center justify-center">
          <div className="w-full h-1 bg-purple-500/20" />
          <div className="absolute w-2 h-1 bg-purple-300 rounded-full animate-traffic-forward" />
        </div>
      </div>

      {/* Bottom-Left Bridge: +5% Turizm */}
      <div className="absolute bottom-6 left-8 z-20 flex flex-col items-center pointer-events-auto">
        <div className="w-28 h-6 border-t-2 border-dashed border-cyan-400/50 relative flex items-center justify-center">
          <div className="w-full h-1 bg-cyan-500/20" />
          <div className="absolute w-2 h-1 bg-cyan-300 rounded-full animate-traffic-reverse" />
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          +5% Turizm
        </div>
      </div>

      {/* Bottom-Right Bridge: @Samar - IT Hab */}
      <div className="absolute bottom-6 right-8 z-20 flex flex-col items-center pointer-events-auto">
        <div className="w-28 h-6 border-t-2 border-dashed border-purple-400/50 relative flex items-center justify-center">
          <div className="w-full h-1 bg-purple-500/20" />
          <div className="absolute w-2 h-1 bg-purple-300 rounded-full animate-traffic-reverse" />
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-purple-500/40 text-[11px] font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          @Samar - IT Hab
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ISOMETRIC CITY CONTAINER (3D Perspective Transform) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="relative transition-transform duration-300"
        style={{
          transform: "perspective(1100px) rotateX(54deg) rotateZ(-34deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer Perimeter Asphalt Highway */}
        <div className="p-5 rounded-3xl bg-slate-950/90 border-4 border-slate-700/50 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative">
          {/* Neon Road Lane Markings */}
          <div className="absolute inset-1.5 rounded-2xl border-2 border-dashed border-cyan-400/20 pointer-events-none" />

          {/* Animated Cyber Cars moving along road */}
          <div className="absolute top-1 left-10 w-3 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-traffic-forward" />
          <div className="absolute bottom-1 right-12 w-3 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-traffic-reverse" />
          <div className="absolute left-1 top-20 w-1.5 h-3 bg-pink-400 rounded-full shadow-[0_0_8px_rgba(244,114,182,0.8)] animate-traffic-down" />
          <div className="absolute right-1 bottom-20 w-1.5 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-traffic-up" />

          {/* Inner 5x5 Isometric Grid */}
          <div className="grid grid-cols-5 gap-3 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/20 shadow-inner">
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => {
                const key = `${x},${y}`;
                const building = buildingMap.get(key);
                const isHovered = hoveredTile === key;

                if (building) {
                  return (
                    <div
                      key={key}
                      onClick={() => onSelectBuilding(building)}
                      onMouseEnter={() => setHoveredTile(key)}
                      onMouseLeave={() => setHoveredTile(null)}
                      className="group relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl glass-card border border-cyan-400/30 p-1 flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_15px_30px_rgba(6,182,212,0.4)]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Counter-rotation to make 3D building stand vertically */}
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          transform: "rotateZ(34deg) rotateX(-54deg)",
                        }}
                      >
                        {renderBuilding3D(building)}
                      </div>
                    </div>
                  );
                }

                // Empty Plot
                return (
                  <div
                    key={key}
                    onClick={() => onSelectEmptyTile(x, y)}
                    onMouseEnter={() => setHoveredTile(key)}
                    onMouseLeave={() => setHoveredTile(null)}
                    className="group relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 border-dashed border-cyan-500/25 bg-slate-950/40 hover:bg-cyan-500/10 hover:border-cyan-400 p-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(6,182,212,0.2)]"
                  >
                    <div className="p-1.5 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-slate-500 group-hover:text-cyan-300 transition">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-mono text-slate-600 group-hover:text-cyan-300 mt-1">
                      ({x}, {y})
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
