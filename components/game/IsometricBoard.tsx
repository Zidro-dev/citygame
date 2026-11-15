"use client";

import React, { useState } from "react";
import { GRID_SIZE, BUILDING_CATALOG } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import { formatCurrency } from "@/lib/utils";
import {
  IsometricDefs,
  YashilTurarJoylar3D,
  TijoratSanoat3D,
  IlmFanLab3D,
  KongilocharMarkaz3D,
  ModernTower3D,
  EmptyPlot3D,
} from "./isometric/IsometricBuildings3D";

// -----------------------------------------------------------------------------
// Category Styling & Vector Icons Configuration
// -----------------------------------------------------------------------------
function getCategoryDetails(type: string) {
  if (type === "GREEN_RESIDENTIAL" || type === "RESIDENTIAL_SMALL") {
    return {
      category: "RESIDENTIAL",
      color: "#10b981", // Emerald Green
      glow: "url(#glow-green)",
      icon: "green" as const,
    };
  }
  if (type === "COMMERCIAL_SHOP" || type === "COMMERCIAL_MALL") {
    return {
      category: "COMMERCIAL",
      color: "#f59e0b", // Amber/Gold
      glow: "url(#glow-gold)",
      icon: "commercial" as const,
    };
  }
  if (type === "SCIENCE_LAB") {
    return {
      category: "SCIENCE",
      color: "#06b6d4", // Cyan
      glow: "url(#glow-cyan)",
      icon: "science" as const,
    };
  }
  if (type === "ENTERTAINMENT_CENTER") {
    return {
      category: "ENTERTAINMENT",
      color: "#ec4899", // Magenta/Pink
      glow: "url(#glow-magenta)",
      icon: "arcade" as const,
    };
  }
  return {
    category: "TOWER",
    color: "#38bdf8", // Sky blue
    glow: "url(#glow-cyan)",
    icon: "tower" as const,
  };
}

// -----------------------------------------------------------------------------
// 1. CLEAN MINI ICON & LEVEL PILL ON THE 3D NODE (Compact, Non-overlapping)
// -----------------------------------------------------------------------------
function BuildingMiniPill({
  x,
  y,
  level,
  type,
  isHovered,
}: {
  x: number;
  y: number;
  level: number;
  type: string;
  isHovered: boolean;
}) {
  const { color, glow, icon } = getCategoryDetails(type);

  return (
    <g
      transform={`translate(${x}, ${y - 48}) scale(${isHovered ? 1.15 : 1})`}
      className="pointer-events-none transition-transform duration-200"
    >
      {/* Sleek Dark Glass Mini Capsule - only 34px wide so it never overlaps neighboring tiles */}
      <rect
        x="-17"
        y="-9"
        width="34"
        height="18"
        rx="9"
        fill="#030712"
        fillOpacity="0.94"
        stroke={color}
        strokeWidth="1.2"
        filter={isHovered ? glow : undefined}
      />

      {/* Clean Category Mini Icon on the left */}
      {icon === "green" && (
        <g transform="translate(-8.5, 0)">
          <polygon points="-3.5 3 0 -3.5 3.5 3" fill="#22c55e" />
          <rect x="-0.8" y="2" width="1.6" height="2" fill="#15803d" />
        </g>
      )}
      {icon === "commercial" && (
        <g transform="translate(-8.5, 0)">
          <circle cx="0" cy="0" r="3.8" fill="#f59e0b" />
          <text x="0" y="2" fill="#78350f" fontSize="4.8" fontWeight="900" textAnchor="middle">
            $
          </text>
        </g>
      )}
      {icon === "science" && (
        <g transform="translate(-8.5, 0)">
          <circle cx="0" cy="0" r="2" fill="#67e8f9" />
          <ellipse
            cx="0"
            cy="0"
            rx="4.2"
            ry="1.8"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            transform="rotate(30)"
          />
        </g>
      )}
      {icon === "arcade" && (
        <g transform="translate(-8.5, 0)">
          <rect x="-3.5" y="-2.5" width="7" height="5" rx="1.5" fill="#ec4899" />
          <circle cx="-1.5" cy="0" r="0.7" fill="#ffffff" />
          <circle cx="1.5" cy="0" r="0.7" fill="#ffffff" />
        </g>
      )}
      {icon === "tower" && (
        <g transform="translate(-8.5, 0)">
          <rect x="-2.5" y="-3.5" width="5" height="7" fill="#38bdf8" />
          <line x1="0" y1="-5.5" x2="0" y2="-3.5" stroke="#38bdf8" strokeWidth="0.8" />
        </g>
      )}

      {/* Clean Level Tag on the right */}
      <text
        x="5.5"
        y="2.6"
        fill="#f8fafc"
        fontSize="7"
        fontWeight="900"
        fontFamily="monospace"
        textAnchor="middle"
      >
        L{level}
      </text>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 2. FLOATING BUILDING TOOLTIP / POPUP CARD (Appears on Hover or Click)
// -----------------------------------------------------------------------------
function FloatingBuildingTooltip({
  building,
  x,
  y,
  efficiency = 1.0,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  building: BuildingState;
  x: number;
  y: number;
  efficiency?: number;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { getBuildingInfo, language } = useLanguage();
  const def = BUILDING_CATALOG[building.type];
  const info = getBuildingInfo(building.type);
  const { color, glow, icon } = getCategoryDetails(building.type);

  const W = 192;
  const H = 78;

  // Clamp horizontal coordinate inside board boundary [10, 1090]
  const cx = Math.max(10, Math.min(1100 - W - 10, x - W / 2));

  // Determine whether to show above building or flip below if too close to top edge
  const showBelow = y - 56 - H < 15;
  const cy = showBelow ? y + 28 : y - 56 - H;
  const caretX = Math.max(cx + 15, Math.min(cx + W - 15, x));

  // Stats calculation
  const currentIncome = def ? def.baseIncome * Math.pow(1.4, building.level - 1) : 0;
  const currentPop = def ? def.basePopulation * building.level : 0;

  return (
    <g
      id="floating-building-tooltip"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer transition-all duration-200"
    >
      {/* Downward or Upward Caret Pointer */}
      {showBelow ? (
        <polygon
          points={`${caretX - 7} ${cy} ${caretX} ${cy - 8} ${caretX + 7} ${cy}`}
          fill="#030712"
          stroke={color}
          strokeWidth="1.5"
        />
      ) : (
        <polygon
          points={`${caretX - 7} ${cy + H} ${caretX} ${cy + H + 8} ${caretX + 7} ${cy + H}`}
          fill="#030712"
          stroke={color}
          strokeWidth="1.5"
        />
      )}

      {/* Main Glassmorphic Popup Card */}
      <rect
        x={cx}
        y={cy}
        width={W}
        height={H}
        rx="10"
        fill="#030712"
        fillOpacity="0.96"
        stroke={color}
        strokeWidth="1.5"
        filter={glow}
      />

      {/* Header Row: Category Mini Icon + Building Name + Level Pill */}
      <circle cx={cx + 18} cy={cy + 18} r="8" fill={color + "30"} stroke={color} strokeWidth="1" />
      {icon === "green" && (
        <g transform={`translate(${cx + 18}, ${cy + 18})`}>
          <polygon points="-3 2 0 -3 3 2" fill="#22c55e" />
        </g>
      )}
      {icon === "commercial" && (
        <text x={cx + 18} y={cy + 21} fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">
          $
        </text>
      )}
      {icon === "science" && (
        <circle cx={cx + 18} cy={cy + 18} r="2.5" fill="#67e8f9" />
      )}
      {icon === "arcade" && (
        <rect x={cx + 15} y={cy + 16} width="6" height="4" rx="1" fill="#ec4899" />
      )}
      {icon === "tower" && (
        <rect x={cx + 16} y={cy + 14} width="4" height="7" fill="#38bdf8" />
      )}

      {/* Building Name */}
      <text
        x={cx + 32}
        y={cy + 21}
        fill="#ffffff"
        fontSize="10"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        {info.name}
      </text>

      {/* Level Tag Pill */}
      <rect
        x={cx + W - 50}
        y={cy + 10}
        width="40"
        height="16"
        rx="8"
        fill={color + "25"}
        stroke={color}
        strokeWidth="1"
      />
      <text
        x={cx + W - 30}
        y={cy + 21.5}
        fill={color}
        fontSize="8"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
      >
        Lv.{building.level}
      </text>

      {/* Divider */}
      <line x1={cx + 12} y1={cy + 33} x2={cx + W - 12} y2={cy + 33} stroke="#1e293b" strokeWidth="1" />

      {/* Middle Stats Row */}
      {/* Stat 1: Efficiency */}
      <text x={cx + 14} y={cy + 46} fill="#94a3b8" fontSize="7.5">
        {language === "uz" ? "Samaradorlik:" : "Efficiency:"}
      </text>
      <text x={cx + 74} y={cy + 46} fill="#22c55e" fontSize="8" fontWeight="bold" fontFamily="monospace">
        {Math.round(efficiency * 100)}%
      </text>

      {/* Stat 2: Output / Revenue */}
      {def?.category === "COMMERCIAL" && (
        <>
          <text x={cx + 104} y={cy + 46} fill="#94a3b8" fontSize="7.5">
            {language === "uz" ? "Daromad:" : "Income:"}
          </text>
          <text x={cx + 146} y={cy + 46} fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
            +{formatCurrency(currentIncome)}/s
          </text>
        </>
      )}
      {def?.category === "RESIDENTIAL" && (
        <>
          <text x={cx + 104} y={cy + 46} fill="#94a3b8" fontSize="7.5">
            {language === "uz" ? "Aholi:" : "Population:"}
          </text>
          <text x={cx + 144} y={cy + 46} fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            +{currentPop} ta
          </text>
        </>
      )}
      {def?.category === "SCIENCE" && (
        <>
          <text x={cx + 104} y={cy + 46} fill="#94a3b8" fontSize="7.5">
            {language === "uz" ? "Ilm-fan:" : "Science:"}
          </text>
          <text x={cx + 146} y={cy + 46} fill="#a855f7" fontSize="8" fontWeight="bold" fontFamily="monospace">
            +2/s
          </text>
        </>
      )}
      {def?.category === "ENTERTAINMENT" && (
        <>
          <text x={cx + 104} y={cy + 46} fill="#94a3b8" fontSize="7.5">
            {language === "uz" ? "Bonus:" : "Bonus:"}
          </text>
          <text x={cx + 144} y={cy + 46} fill="#ec4899" fontSize="8" fontWeight="bold">
            2x Boost
          </text>
        </>
      )}

      {/* Action Footer Button */}
      <rect
        x={cx + 12}
        y={cy + 55}
        width={W - 24}
        height="16"
        rx="6"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="0.8"
      />
      <text
        x={cx + W / 2}
        y={cy + 66}
        fill="#38bdf8"
        fontSize="7.5"
        fontWeight="bold"
        textAnchor="middle"
      >
        {language === "uz" ? "⚡ Bosing: Yangilash (Upgrade) ↗" : "⚡ Click: Upgrade building ↗"}
      </text>
    </g>
  );
}

// -----------------------------------------------------------------------------
// IsometricBoard Component
// -----------------------------------------------------------------------------
interface IsometricBoardProps {
  buildings: BuildingState[];
  efficiency?: number;
  onSelectEmptyTile: (x: number, y: number) => void;
  onSelectBuilding: (building: BuildingState) => void;
}

export function IsometricBoard({
  buildings,
  efficiency = 1.0,
  onSelectEmptyTile,
  onSelectBuilding,
}: IsometricBoardProps) {
  const [selectedHoverId, setSelectedHoverId] = useState<string | null>(null);

  // Pan and Zoom interactive state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const initialPinchDistRef = React.useRef<number | null>(null);
  const initialPinchZoomRef = React.useRef<number>(1);
  const hasMovedRef = React.useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    if (Math.hypot(newX - pan.x, newY - pan.y) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((prev) => Math.min(2.4, Math.max(0.6, +(prev + delta).toFixed(2))));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
      hasMovedRef.current = false;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = zoom;
      hasMovedRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragStartRef.current) {
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      if (Math.hypot(newX - pan.x, newY - pan.y) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }
      setPan({ x: newX, y: newY });
    } else if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialPinchDistRef.current;
      setZoom(Math.min(2.4, Math.max(0.6, +(initialPinchZoomRef.current * factor).toFixed(2))));
    }
  };

  const handleTouchEnd = () => {
    dragStartRef.current = null;
    initialPinchDistRef.current = null;
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Map buildings by coordinates "x,y" for O(1) lookup
  const buildingMap = new Map<string, BuildingState>();
  for (const b of buildings) {
    buildingMap.set(`${b.grid_x},${b.grid_y}`, b);
  }

  // 10x10 Isometric Grid Projection Constants
  const TILE_W = 72;
  const TILE_H = 36;
  const ORIGIN_X = 550;
  const ORIGIN_Y = 120;

  const getScreenCoords = (gx: number, gy: number) => {
    return {
      x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
      y: ORIGIN_Y + (gx + gy) * (TILE_H / 2),
    };
  };

  // Generate all 10x10 (100) tile positions sorted by depth (gx + gy)
  const tiles = [];
  for (let gy = 0; gy < GRID_SIZE; gy++) {
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      tiles.push({ gx, gy, depth: gx + gy });
    }
  }
  tiles.sort((a, b) => a.depth - b.depth);

  // Currently active / hovered building
  const hoveredBuilding = selectedHoverId ? buildingMap.get(selectedHoverId) : null;
  const hoveredCoords = hoveredBuilding
    ? getScreenCoords(hoveredBuilding.grid_x, hoveredBuilding.grid_y)
    : null;

  return (
    <div
      className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[520px] h-[72vh] md:h-[80vh] p-1 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. FLOATING SCI-FI ALLIANCE BADGES & STATS */}
      {/* ------------------------------------------------------------------ */}

      {/* Top-Left Bridge Tag: @Ali - Yashil shahar */}
      <div className="absolute top-2 left-6 z-20 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-xs font-black text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>@Ali - Yashil shahar</span>
        </div>
      </div>

      {/* Top-Right Bridge Tag: @Samar - IT Hab with +15% Hamkorlik Bonusi */}
      <div className="absolute top-2 right-6 z-20 flex flex-col items-end pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/90 border border-purple-400/50 text-xs font-black text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>@Samar - IT Hab</span>
        </div>
        <div className="mt-1.5 px-3 py-1 rounded-2xl bg-emerald-950/90 border border-emerald-400/50 text-xs text-emerald-300 font-black text-right shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          +15% Hamkorlik Bonusi
          <span className="block text-[9px] font-normal text-slate-300">
            (Sanoat-Yashil hamkorligi)
          </span>
        </div>
      </div>

      {/* Bottom-Left Bridge Tag: +5% Turizm */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-xs font-black text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>+5% Turizm</span>
        </div>
      </div>

      {/* Bottom-Right Bridge Tag: @Samar - IT Hab */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/90 border border-purple-400/50 text-xs font-black text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>@Samar - IT Hab</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MASTER 10x10 ISOMETRIC VECTOR WORLD (SVG) */}
      {/* ------------------------------------------------------------------ */}
      <svg
        viewBox="0 0 1100 680"
        className="w-full h-auto max-h-[78vh] drop-shadow-2xl overflow-visible"
      >
        <IsometricDefs />

        {/* Dynamic Zoom & Pan Transform Container */}
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{
            transformOrigin: "550px 340px",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          {/* Ambient Ground Glow */}
          <ellipse cx="550" cy="360" rx="460" ry="220" fill="url(#glass-front)" opacity="0.08" />

        {/* -------------------------------------------------------------- */}
        {/* FOUR THICK ILLUMINATED GLOWING ENERGY-BRIDGE PATHWAYS */}
        {/* -------------------------------------------------------------- */}
        {/* Top-Left Energy Bridge: To @Ali - Yashil shahar */}
        <g id="energy-bridge-top-left">
          {/* Outer Road Bed */}
          <polygon points="60 40 370 190 350 205 40 55" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          {/* Thick Glowing Cyan Energy Beam Pathway */}
          <line
            x1="50"
            y1="48"
            x2="360"
            y2="198"
            stroke="url(#energy-cyan)"
            strokeWidth="10"
            filter="url(#glow-cyan)"
          />
          <line
            x1="50"
            y1="48"
            x2="360"
            y2="198"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="14 10"
            className="animate-pulse"
          />
          {/* Suspension Pylon Tower */}
          <line x1="200" y1="120" x2="200" y2="30" stroke="#0ea5e9" strokeWidth="6" />
          <line x1="200" y1="30" x2="60" y2="45" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          <line x1="200" y1="30" x2="350" y2="195" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          <circle cx="200" cy="30" r="4" fill="#38bdf8" filter="url(#glow-cyan)" />
        </g>

        {/* Top-Right Energy Bridge: To @Samar - IT Hab */}
        <g id="energy-bridge-top-right">
          {/* Outer Road Bed */}
          <polygon points="1040 40 730 190 750 205 1060 55" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          {/* Thick Glowing Magenta / Purple Energy Beam Pathway */}
          <line
            x1="1050"
            y1="48"
            x2="740"
            y2="198"
            stroke="url(#energy-purple)"
            strokeWidth="10"
            filter="url(#glow-magenta)"
          />
          <line
            x1="1050"
            y1="48"
            x2="740"
            y2="198"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="14 10"
            className="animate-pulse"
          />
          {/* Suspension Pylon Tower */}
          <line x1="900" y1="120" x2="900" y2="30" stroke="#a855f7" strokeWidth="6" />
          <line x1="900" y1="30" x2="1040" y2="45" stroke="#c084fc" strokeWidth="2" opacity="0.8" />
          <line x1="900" y1="30" x2="750" y2="195" stroke="#c084fc" strokeWidth="2" opacity="0.8" />
          <circle cx="900" cy="30" r="4" fill="#c084fc" filter="url(#glow-magenta)" />
        </g>

        {/* Bottom-Left Energy Bridge: To Allied Region (+5% Turizm) */}
        <g id="energy-bridge-bottom-left">
          <polygon points="60 640 370 490 350 475 40 625" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          <line
            x1="50"
            y1="632"
            x2="360"
            y2="482"
            stroke="url(#energy-cyan)"
            strokeWidth="10"
            filter="url(#glow-cyan)"
          />
          <line
            x1="50"
            y1="632"
            x2="360"
            y2="482"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="14 10"
            className="animate-pulse"
          />
          <line x1="200" y1="560" x2="200" y2="470" stroke="#10b981" strokeWidth="6" />
          <line x1="200" y1="470" x2="60" y2="635" stroke="#34d399" strokeWidth="2" opacity="0.8" />
          <line x1="200" y1="470" x2="350" y2="485" stroke="#34d399" strokeWidth="2" opacity="0.8" />
          <circle cx="200" cy="470" r="4" fill="#34d399" filter="url(#glow-green)" />
        </g>

        {/* Bottom-Right Energy Bridge: To @Samar - IT Hab */}
        <g id="energy-bridge-bottom-right">
          <polygon points="1040 640 730 490 750 475 1060 625" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          <line
            x1="1050"
            y1="632"
            x2="740"
            y2="482"
            stroke="url(#energy-purple)"
            strokeWidth="10"
            filter="url(#glow-magenta)"
          />
          <line
            x1="1050"
            y1="632"
            x2="740"
            y2="482"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="14 10"
            className="animate-pulse"
          />
          <line x1="900" y1="560" x2="900" y2="470" stroke="#a855f7" strokeWidth="6" />
          <line x1="900" y1="470" x2="1040" y2="635" stroke="#c084fc" strokeWidth="2" opacity="0.8" />
          <line x1="900" y1="470" x2="750" y2="485" stroke="#c084fc" strokeWidth="2" opacity="0.8" />
          <circle cx="900" cy="470" r="4" fill="#c084fc" filter="url(#glow-magenta)" />
        </g>

        {/* -------------------------------------------------------------- */}
        {/* PERIMETER ASPHALT HIGHWAY RING WITH CARS AROUND 10x10 GRID */}
        {/* -------------------------------------------------------------- */}
        <g id="perimeter-highway">
          {/* Ground Mesh Platform underneath 10x10 Grid */}
          <polygon
            points="550 80 950 280 550 480 150 280"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="4"
            opacity="0.3"
          />

          {/* Outer Road Highway Ring */}
          <polygon
            points="550 70 960 275 960 305 550 510 140 305 140 275"
            fill="none"
            stroke="#0f172a"
            strokeWidth="38"
          />
          <polygon
            points="550 70 960 275 960 305 550 510 140 305 140 275"
            fill="none"
            stroke="#1e293b"
            strokeWidth="32"
          />
          {/* Dashed Center Road Markings */}
          <polygon
            points="550 70 960 275 960 305 550 510 140 305 140 275"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.8"
            strokeDasharray="8 10"
            opacity="0.75"
          />

          {/* Animated 3D Cyber Vehicles on Road Ring */}
          {/* Cyber Hovercar 1 (Yellow) */}
          <g transform="translate(360, 160)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#facc15" filter="url(#glow-gold)" />
            <polygon points="-5 0 0 -3.5 6 0 0 3.5" fill="#fef08a" />
          </g>

          {/* Cyber Hovercar 2 (Cyan) */}
          <g transform="translate(740, 400)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#38bdf8" filter="url(#glow-cyan)" />
            <polygon points="-5 0 0 -3.5 6 0 0 3.5" fill="#bae6fd" />
          </g>

          {/* Futuristic Metro Bus (Pink & White) */}
          <g transform="translate(680, 430)">
            <polygon points="-14 -3 5 6 15 1 -5 -8" fill="#ec4899" filter="url(#glow-magenta)" />
            <polygon points="-14 -7 5 2 15 -3 -5 -12" fill="#ffffff" />
          </g>
        </g>

        {/* -------------------------------------------------------------- */}
        {/* 3. 10x10 ISOMETRIC GRID (100 TILES, DEPTH SORTED) */}
        {/* -------------------------------------------------------------- */}
        <g id="city-10x10-tiles">
          {tiles.map(({ gx, gy }) => {
            const { x, y } = getScreenCoords(gx, gy);
            const key = `${gx},${gy}`;
            const building = buildingMap.get(key);

            if (!building) {
              return (
                <EmptyPlot3D
                  key={key}
                  x={x}
                  y={y}
                  gridX={gx}
                  gridY={gy}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    onSelectEmptyTile(gx, gy);
                  }}
                />
              );
            }

            // Render specific 3D isometric building model
            const isGreen =
              building.type === "GREEN_RESIDENTIAL" ||
              building.type === "RESIDENTIAL_SMALL";
            const isTijorat =
              building.type === "COMMERCIAL_SHOP" ||
              building.type === "COMMERCIAL_MALL";
            const isLab = building.type === "SCIENCE_LAB";
            const isArcade = building.type === "ENTERTAINMENT_CENTER";
            const isTower =
              building.type === "RESIDENTIAL_TOWER" ||
              building.type === "COMMERCIAL_OFFICE";

            return (
              <g
                key={key}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  setSelectedHoverId(key);
                  onSelectBuilding(building);
                }}
                onMouseEnter={() => setSelectedHoverId(key)}
                onMouseLeave={() => setSelectedHoverId(null)}
                className="transition-transform duration-200"
              >
                {/* Volumetric 3D Model Asset */}
                {isGreen && <YashilTurarJoylar3D x={x} y={y} level={building.level} />}
                {isTijorat && <TijoratSanoat3D x={x} y={y} level={building.level} />}
                {isLab && <IlmFanLab3D x={x} y={y} level={building.level} />}
                {isArcade && <KongilocharMarkaz3D x={x} y={y} level={building.level} />}
                {isTower && <ModernTower3D x={x} y={y} level={building.level} />}
                {!isGreen && !isTijorat && !isLab && !isArcade && !isTower && (
                  <ModernTower3D x={x} y={y} level={building.level} />
                )}

                {/* Clean, Non-overlapping Mini Icon & Level Pill on the 3D node */}
                <BuildingMiniPill
                  x={x}
                  y={y}
                  level={building.level}
                  type={building.type}
                  isHovered={selectedHoverId === key}
                />
              </g>
            );
          })}
        </g>

        {/* -------------------------------------------------------------- */}
        {/* 4. ACTIVE FLOATING TOOLTIP / POPUP CARD (Top Layer, Never Clipped) */}
        {/* -------------------------------------------------------------- */}
        {hoveredBuilding && hoveredCoords && (
          <FloatingBuildingTooltip
            building={hoveredBuilding}
            x={hoveredCoords.x}
            y={hoveredCoords.y}
            efficiency={efficiency}
            onClick={() => onSelectBuilding(hoveredBuilding)}
            onMouseEnter={() => setSelectedHoverId(selectedHoverId)}
            onMouseLeave={() => setSelectedHoverId(null)}
          />
        )}
        </g>
      </svg>

      {/* Floating Sci-Fi Zoom & Reset Controls */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-1.5 backdrop-blur-xl shadow-2xl">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(1)));
          }}
          title="Zoom In"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center border border-cyan-500/30 active:scale-90 transition cursor-pointer text-sm"
        >
          +
        </button>
        <span className="text-[10px] font-mono font-bold text-cyan-200 px-1 min-w-[34px] text-center select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)));
          }}
          title="Zoom Out"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center border border-cyan-500/30 active:scale-90 transition cursor-pointer text-sm"
        >
          -
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetView();
          }}
          title="Reset View"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 hover:bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center border border-purple-500/30 active:scale-90 transition cursor-pointer text-xs ml-0.5"
        >
          ⟲
        </button>
      </div>

      {/* Mobile Gesture Hint */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none lg:hidden">
        <div className="px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-500/30 text-[10px] text-cyan-300/90 font-mono tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <span>🤏 Chimchilab masshtablang • Siljiting</span>
        </div>
      </div>
    </div>
  );
}
