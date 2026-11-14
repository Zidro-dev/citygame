"use client";

import React, { useState } from "react";
import { GRID_SIZE, BUILDING_CATALOG } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import {
  IsometricDefs,
  YashilTurarJoylar3D,
  TijoratSanoat3D,
  IlmFanLab3D,
  KongilocharMarkaz3D,
  ModernTower3D,
  EmptyPlot3D,
} from "./isometric/IsometricBuildings3D";

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
  const { getBuildingInfo } = useLanguage();
  const [selectedHoverId, setSelectedHoverId] = useState<string | null>(null);

  // Map buildings by coordinates "x,y" for O(1) lookup
  const buildingMap = new Map<string, BuildingState>();
  for (const b of buildings) {
    buildingMap.set(`${b.grid_x},${b.grid_y}`, b);
  }

  // Isometric Grid Projection Constants
  const TILE_W = 108;
  const TILE_H = 54;
  const ORIGIN_X = 500;
  const ORIGIN_Y = 190;

  const getScreenCoords = (gx: number, gy: number) => {
    return {
      x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
      y: ORIGIN_Y + (gx + gy) * (TILE_H / 2),
    };
  };

  // Generate all 25 tile positions sorted by depth (gx + gy) for 100% correct isometric overlap
  const tiles = [];
  for (let gy = 0; gy < GRID_SIZE; gy++) {
    for (let gx = 0; gx < GRID_SIZE; gx++) {
      tiles.push({ gx, gy, depth: gx + gy });
    }
  }
  tiles.sort((a, b) => a.depth - b.depth);

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[580px] p-1 overflow-hidden select-none">
      {/* ------------------------------------------------------------------ */}
      {/* 1. FLOATING OVERLAY LABELS & BADGES (Matching Reference Image) */}
      {/* ------------------------------------------------------------------ */}

      {/* Top-Left Bridge Tag: @Ali - Yashil shahar */}
      <div className="absolute top-2 left-6 z-20 pointer-events-auto">
        <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          @Ali - Yashil shahar
        </div>
      </div>

      {/* Top-Right Bridge Tag: @Samar - IT Hab with +15% Hamkorlik Bonusi */}
      <div className="absolute top-2 right-6 z-20 flex flex-col items-end pointer-events-auto">
        <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-purple-500/40 text-xs font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          @Samar - IT Hab
        </div>
        <div className="mt-1 px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold text-right shadow-sm">
          +15% Hamkorlik Bonusi
          <span className="block text-[9px] font-normal text-slate-400">
            (Sanoat-Yashil hamkorligi)
          </span>
        </div>
      </div>

      {/* Bottom-Left Bridge Tag: +5% Turizm */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-auto">
        <div className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          +5% Turizm
        </div>
      </div>

      {/* Bottom-Right Bridge Tag: @Samar - IT Hab */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-auto">
        <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-purple-500/40 text-xs font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          @Samar - IT Hab
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MASTER 3D ISOMETRIC VECTOR WORLD (SVG) */}
      {/* ------------------------------------------------------------------ */}
      <svg
        viewBox="0 0 1000 620"
        className="w-full h-auto max-h-[75vh] drop-shadow-2xl overflow-visible"
      >
        <IsometricDefs />

        {/* Ambient Ground Grid Glow */}
        <ellipse cx="500" cy="320" rx="380" ry="180" fill="url(#glass-front)" opacity="0.06" />

        {/* -------------------------------------------------------------- */}
        {/* FOUR SUSPENSION BRIDGES CONNECTING TO CORNERS */}
        {/* -------------------------------------------------------------- */}
        {/* Top-Left Bridge */}
        <g id="bridge-top-left">
          {/* Bridge Road Deck */}
          <polygon points="120 70 340 180 320 190 100 80" fill="#1e293b" stroke="#334155" />
          {/* Suspension Pylon Tower */}
          <line x1="210" y1="115" x2="210" y2="40" stroke="#0ea5e9" strokeWidth="4" />
          <line x1="210" y1="40" x2="110" y2="75" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
          <line x1="210" y1="40" x2="330" y2="185" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
          {/* Neon Deck Light */}
          <line x1="120" y1="70" x2="340" y2="180" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-cyan)" />
        </g>

        {/* Top-Right Bridge */}
        <g id="bridge-top-right">
          {/* Bridge Road Deck */}
          <polygon points="880 70 660 180 680 190 900 80" fill="#1e293b" stroke="#334155" />
          {/* Suspension Pylon Tower */}
          <line x1="790" y1="115" x2="790" y2="40" stroke="#a855f7" strokeWidth="4" />
          <line x1="790" y1="40" x2="890" y2="75" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
          <line x1="790" y1="40" x2="670" y2="185" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
          {/* Neon Deck Light */}
          <line x1="880" y1="70" x2="660" y2="180" stroke="#a855f7" strokeWidth="2" filter="url(#glow-magenta)" />
        </g>

        {/* Bottom-Left Bridge */}
        <g id="bridge-bottom-left">
          <polygon points="120 540 340 430 320 420 100 530" fill="#1e293b" stroke="#334155" />
          <line x1="210" y1="495" x2="210" y2="420" stroke="#10b981" strokeWidth="4" />
          <line x1="210" y1="420" x2="110" y2="535" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
          <line x1="210" y1="420" x2="330" y2="425" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
          <line x1="120" y1="540" x2="340" y2="430" stroke="#10b981" strokeWidth="2" filter="url(#glow-cyan)" />
        </g>

        {/* Bottom-Right Bridge */}
        <g id="bridge-bottom-right">
          <polygon points="880 540 660 430 680 420 900 530" fill="#1e293b" stroke="#334155" />
          <line x1="790" y1="495" x2="790" y2="420" stroke="#a855f7" strokeWidth="4" />
          <line x1="790" y1="420" x2="890" y2="535" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
          <line x1="790" y1="420" x2="670" y2="425" stroke="#c084fc" strokeWidth="1.2" opacity="0.7" />
          <line x1="880" y1="540" x2="660" y2="430" stroke="#c084fc" strokeWidth="2" filter="url(#glow-magenta)" />
        </g>

        {/* -------------------------------------------------------------- */}
        {/* PERIMETER HIGHWAY / ROADS AROUND 5x5 GRID */}
        {/* -------------------------------------------------------------- */}
        <g id="road-network">
          {/* Outer Road Ring (Dark Asphalt) */}
          <polygon
            points="500 100 780 240 780 270 500 410 220 270 220 240"
            fill="none"
            stroke="#0f172a"
            strokeWidth="32"
          />
          <polygon
            points="500 100 780 240 780 270 500 410 220 270 220 240"
            fill="none"
            stroke="#1e293b"
            strokeWidth="28"
          />
          {/* Dashed Center Road Markings */}
          <polygon
            points="500 100 780 240 780 270 500 410 220 270 220 240"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.6"
          />

          {/* Animated 3D Cyber Vehicles on Roads */}
          {/* Cyber Hovercar 1 (Yellow) */}
          <g transform="translate(360, 170)">
            <ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#facc15" filter="url(#glow-gold)" />
            <polygon points="-4 0 0 -3 5 0 0 3" fill="#fef08a" />
          </g>

          {/* Cyber Hovercar 2 (Cyan) */}
          <g transform="translate(640, 340)">
            <ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#38bdf8" filter="url(#glow-cyan)" />
            <polygon points="-4 0 0 -3 5 0 0 3" fill="#bae6fd" />
          </g>

          {/* Futuristic Metro Transit Bus (Pink/White) */}
          <g transform="translate(560, 380)">
            <polygon points="-12 -3 4 5 12 1 -4 -7" fill="#f43f5e" />
            <polygon points="-12 -7 4 1 12 -3 -4 -11" fill="#fff" />
          </g>
        </g>

        {/* -------------------------------------------------------------- */}
        {/* 3. 5x5 ISOMETRIC TILES & 3D BUILDINGS (DEPTH SORTED) */}
        {/* -------------------------------------------------------------- */}
        <g id="city-tiles">
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
                  onClick={() => onSelectEmptyTile(gx, gy)}
                />
              );
            }

            // Render specific 3D isometric building model
            const def = BUILDING_CATALOG[building.type];
            const info = getBuildingInfo(building.type);

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
                onClick={() => onSelectBuilding(building)}
                onMouseEnter={() => setSelectedHoverId(key)}
                onMouseLeave={() => setSelectedHoverId(null)}
                className="transition-transform duration-200"
              >
                {/* 3D Model */}
                {isGreen && <YashilTurarJoylar3D x={x} y={y} />}
                {isTijorat && <TijoratSanoat3D x={x} y={y} />}
                {isLab && <IlmFanLab3D x={x} y={y} />}
                {isArcade && <KongilocharMarkaz3D x={x} y={y} />}
                {isTower && <ModernTower3D x={x} y={y} />}
                {!isGreen && !isTijorat && !isLab && !isArcade && !isTower && (
                  <ModernTower3D x={x} y={y} />
                )}

                {/* Floating 3D Building Title & Level Badge */}
                <g
                  transform={`translate(${x}, ${y - 68})`}
                  className="pointer-events-none transition-transform duration-200 group-hover:scale-105"
                >
                  {/* Glass Badge Background */}
                  <rect
                    x="-48"
                    y="-11"
                    width="96"
                    height="20"
                    rx="10"
                    fill="#020617"
                    fillOpacity="0.92"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeOpacity="0.7"
                    filter="url(#glow-cyan)"
                  />
                  {/* Building Name */}
                  <text
                    x="-6"
                    y="3"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {info.name}
                  </text>
                  {/* Level Pill */}
                  <rect
                    x="24"
                    y="-7"
                    width="18"
                    height="12"
                    rx="6"
                    fill="#0284c7"
                    fillOpacity="0.5"
                  />
                  <text
                    x="33"
                    y="2"
                    fill="#38bdf8"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    L{building.level}
                  </text>

                  {/* Sub Badge for Green Residential (👥 401 👤 99) */}
                  {isGreen && (
                    <g transform="translate(0, 17)">
                      <rect
                        x="-30"
                        y="-7"
                        width="60"
                        height="14"
                        rx="7"
                        fill="#064e3b"
                        fillOpacity="0.9"
                        stroke="#10b981"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        fill="#6ee7b7"
                        fontSize="7.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        👥 401 👤 99
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
