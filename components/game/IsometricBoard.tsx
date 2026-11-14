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
  const { getBuildingInfo, language } = useLanguage();
  const [selectedHoverId, setSelectedHoverId] = useState<string | null>(null);

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

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[620px] p-1 overflow-hidden select-none">
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

            const tierLabel = `${building.level}-bosqich (Lv.${building.level})`;

            return (
              <g
                key={key}
                onClick={() => onSelectBuilding(building)}
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

                {/* Floating 3D Building Title & Actual Upgrade Tier Badge */}
                <g
                  transform={`translate(${x}, ${y - 56})`}
                  className="pointer-events-none transition-transform duration-200 group-hover:scale-105"
                >
                  {/* Glassmorphic Badge Background */}
                  <rect
                    x="-54"
                    y="-11"
                    width="108"
                    height="20"
                    rx="10"
                    fill="#020617"
                    fillOpacity="0.94"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                    filter="url(#glow-cyan)"
                  />
                  {/* Building Name */}
                  <text
                    x="-10"
                    y="3"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {info.name}
                  </text>
                  {/* Tier Badge showing actual upgrade level (e.g. 3-bosqich, Lv.3) */}
                  <rect
                    x="22"
                    y="-7"
                    width="26"
                    height="13"
                    rx="6.5"
                    fill="#0284c7"
                    fillOpacity="0.75"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                  />
                  <text
                    x="35"
                    y="2.5"
                    fill="#f0f9ff"
                    fontSize="7"
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Lv.{building.level}
                  </text>

                  {/* Sub Badge for Green Residential (👥 401 👤 99) */}
                  {isGreen && (
                    <g transform="translate(0, 16)">
                      <rect
                        x="-32"
                        y="-7"
                        width="64"
                        height="14"
                        rx="7"
                        fill="#064e3b"
                        fillOpacity="0.92"
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
