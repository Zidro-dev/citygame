"use client";

import React from "react";

// Filter definitions for neon glows, energy beams and 3D lighting
export function IsometricDefs() {
  return (
    <defs>
      {/* Neon Cyan Glow */}
      <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Neon Magenta / Purple Glow */}
      <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gold Coin Glow */}
      <filter id="glow-gold" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Green Cyber Glow */}
      <filter id="glow-green" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Building Drop Shadow */}
      <filter id="building-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="-6" dy="14" stdDeviation="8" floodColor="#000" floodOpacity="0.75" />
      </filter>

      {/* Linear Gradients for 3D Faces */}
      <linearGradient id="wall-left-light" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="wall-right-light" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="roof-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>

      {/* Glass Blue Facade */}
      <linearGradient id="glass-front" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
      <linearGradient id="glass-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>

      {/* Cyberpunk Magenta Store */}
      <linearGradient id="store-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#581c87" />
        <stop offset="100%" stopColor="#2e1065" />
      </linearGradient>
      <linearGradient id="store-right" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86198f" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
      <linearGradient id="store-roof" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a21caf" />
        <stop offset="100%" stopColor="#701a75" />
      </linearGradient>

      {/* Glowing Science Plasma Cylinder */}
      <linearGradient id="plasma-cyan" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.8" />
      </linearGradient>

      {/* Gold Coin Gradient */}
      <radialGradient id="coin-gold" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </radialGradient>

      {/* Energy Bridge Beam Gradients */}
      <linearGradient id="energy-cyan" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>

      <linearGradient id="energy-purple" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
  );
}

// -----------------------------------------------------------------------------
// 1. YASHIL TURAR-JOYLAR (Green Residential Complex with Cottages, Garden & High-Rise)
// -----------------------------------------------------------------------------
export function YashilTurarJoylar3D({
  x,
  y,
  level = 1,
}: {
  x: number;
  y: number;
  level?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Ground Lawn Platform */}
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill="#14532d"
        stroke="#22c55e"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Apartment High-Rise (Back Left) */}
      <g transform="translate(-14, -12)">
        {/* Left Face */}
        <path d="M -12 0 L 0 6 L 0 -42 L -12 -48 Z" fill="#0f172a" stroke="#1e293b" />
        {/* Right Face */}
        <path d="M 0 6 L 14 -1 L 14 -49 L 0 -42 Z" fill="#1e293b" stroke="#334155" />
        {/* Roof Top */}
        <path d="M -12 -48 L 0 -42 L 14 -49 L 2 -55 Z" fill="#334155" stroke="#475569" />

        {/* Windows */}
        {[-6, -16, -26, -36].map((yOffset, i) => (
          <g key={i}>
            <polygon
              points={`-9 ${yOffset - 2} -3 ${yOffset + 1} -3 ${yOffset + 5} -9 ${yOffset + 2}`}
              fill={i % 2 === 0 ? "#38bdf8" : "#fef08a"}
              opacity="0.85"
            />
            <polygon
              points={`3 ${yOffset + 1} 11 ${yOffset - 3} 11 ${yOffset + 1} 3 ${yOffset + 5}`}
              fill={i % 2 === 0 ? "#fef08a" : "#38bdf8"}
              opacity="0.85"
            />
          </g>
        ))}
      </g>

      {/* Residential Cottage (Front Right) */}
      <g transform="translate(10, 2)">
        <path d="M -11 0 L 0 5.5 L 0 -13 L -11 -18.5 Z" fill="#f8fafc" />
        <path d="M 0 5.5 L 13 -1 L 13 -19.5 L 0 -13 Z" fill="#cbd5e1" />
        {/* Pitched Terracotta Roof */}
        <path d="M -12 -18.5 L 0 -12.5 L 0 -24 L -12 -30 Z" fill="#ea580c" />
        <path d="M 0 -12.5 L 14 -19.5 L 14 -31 L 0 -24 Z" fill="#c2410c" />
        {/* Windows */}
        <polygon points="-8 -5 -2 -2 -2 -9 -8 -12" fill="#fef08a" opacity="0.9" />
        <polygon points="2 -3 10 -6 10 -13 2 -10" fill="#fef08a" opacity="0.9" />
      </g>

      {/* Volumetric Green Trees */}
      <g transform="translate(0, 10)">
        <rect x="-1" y="-4" width="2" height="5" fill="#78350f" />
        <circle cx="0" cy="-7" r="5" fill="#15803d" />
        <circle cx="-1.5" cy="-8.5" r="3.5" fill="#22c55e" opacity="0.9" />
      </g>
      <g transform="translate(-22, -2)">
        <rect x="-1" y="-3" width="2" height="4" fill="#78350f" />
        <circle cx="0" cy="-6" r="4" fill="#166534" />
        <circle cx="1" cy="-7.5" r="3" fill="#4ade80" opacity="0.8" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 2. TIJORAT DO'KONLARI VA SANOAT ZAVODLARI (Commercial Store & Factory with TIJORAT Sign)
// -----------------------------------------------------------------------------
export function TijoratSanoat3D({
  x,
  y,
  level = 3,
}: {
  x: number;
  y: number;
  level?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Dark Concrete Base */}
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill="#0f172a"
        stroke="#ec4899"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Main Commercial Store Building */}
      <g transform="translate(-3, 0)">
        {/* Left Wall */}
        <path d="M -18 0 L 0 9 L 0 -26 L -18 -35 Z" fill="url(#store-left)" />
        {/* Right Wall */}
        <path d="M 0 9 L 22 -2 L 22 -37 L 0 -26 Z" fill="url(#store-right)" />
        {/* Roof Top */}
        <path d="M -18 -35 L 0 -26 L 22 -37 L 4 -46 Z" fill="url(#store-roof)" />

        {/* PROMINENT NEON SIGN "TIJORAT" */}
        <g transform="translate(0, -26)">
          <polygon
            points="-18 -5 0 4 0 13 -18 4"
            fill="#831843"
            stroke="#f472b6"
            strokeWidth="1.5"
            filter="url(#glow-magenta)"
          />
          <text
            x="-9"
            y="7.5"
            fill="#fdf2f8"
            fontSize="6"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="0.8"
            transform="skewY(26)"
          >
            TIJORAT
          </text>
        </g>

        {/* Striped Canopy Awning */}
        <polygon points="-16 1 0 9 0 6 -16 -2" fill="#f43f5e" />
        <polygon points="0 9 20 -1 20 -3 0 6" fill="#e11d48" />

        {/* Glowing Display Windows */}
        <polygon points="-15 3 -2 10 -2 15 -15 8" fill="#38bdf8" opacity="0.85" filter="url(#glow-cyan)" />
        <polygon points="2 10 18 2 18 7 2 15" fill="#fbcfe8" opacity="0.85" />
      </g>

      {/* Industrial Factory Section with 3 Smokestacks (Back Right) */}
      <g transform="translate(18, -14)">
        <path d="M -8 0 L 0 4 L 11 -1.5 L 3 -5.5 Z" fill="#334155" />
        <path d="M -8 0 L 0 4 L 0 -14 L -8 -18 Z" fill="#1e293b" />
        <path d="M 0 4 L 11 -1.5 L 11 -19.5 L 0 -14 Z" fill="#475569" />

        {/* 3 Smokestacks */}
        {[
          { cx: -3, cy: -16, h: 18 },
          { cx: 2, cy: -18, h: 22 },
          { cx: 8, cy: -20, h: 16 },
        ].map((st, i) => (
          <g key={i}>
            <rect
              x={st.cx - 2}
              y={st.cy - st.h}
              width="4"
              height={st.h}
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="0.8"
            />
            <ellipse
              cx={st.cx}
              cy={st.cy - st.h}
              rx="2"
              ry="1"
              fill="#f97316"
              filter="url(#glow-gold)"
            />
          </g>
        ))}
      </g>

      {/* Floating 3D Golden Coins */}
      <g transform="translate(14, -48)" filter="url(#glow-gold)" className="animate-bounce-subtle">
        <circle cx="0" cy="0" r="5.5" fill="url(#coin-gold)" stroke="#fef08a" strokeWidth="0.8" />
        <text x="0" y="2" fill="#78350f" fontSize="5.5" fontWeight="bold" textAnchor="middle">
          $
        </text>
      </g>
      <g transform="translate(24, -42)" filter="url(#glow-gold)">
        <circle cx="0" cy="0" r="4" fill="url(#coin-gold)" stroke="#fef08a" strokeWidth="0.6" />
        <text x="0" y="1.5" fill="#78350f" fontSize="4" fontWeight="bold" textAnchor="middle">
          $
        </text>
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 3. ILM-FAN LABORATORIYASI (Science Lab with Holographic Atom & Plasma Tubes)
// -----------------------------------------------------------------------------
export function IlmFanLab3D({
  x,
  y,
  level = 1,
}: {
  x: number;
  y: number;
  level?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* High-Tech Hex Base */}
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill="#082f49"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />

      {/* Main Laboratory Facility */}
      <g transform="translate(0, 3)">
        <path d="M -20 0 L 0 10 L 0 -22 L -20 -32 Z" fill="#0f172a" stroke="#1e293b" />
        <path d="M 0 10 L 20 0 L 20 -22 L 0 -12 Z" fill="#0369a1" stroke="#0284c7" />
        <path d="M -20 -32 L 0 -22 L 20 -32 L 0 -42 Z" fill="#0284c7" />

        {/* Cyan Glowing Tech Circuit Lines */}
        <polyline points="-16 -8 -9 -4 -9 -20" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.85" />
        <polyline points="3 -4 14 -9 14 -24" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.85" />
      </g>

      {/* Two Glowing Cyan Plasma Containment Cylinders */}
      <g transform="translate(-11, -16)">
        <ellipse cx="0" cy="6" rx="5" ry="2.5" fill="#0891b2" />
        <rect x="-5" y="-10" width="10" height="16" fill="url(#plasma-cyan)" filter="url(#glow-cyan)" />
        <ellipse cx="0" cy="-10" rx="5" ry="2.5" fill="#cffafe" />
        <ellipse cx="0" cy="-11" rx="5.5" ry="2.8" fill="#334155" />
      </g>

      <g transform="translate(11, -16)">
        <ellipse cx="0" cy="6" rx="5" ry="2.5" fill="#0891b2" />
        <rect x="-5" y="-10" width="10" height="16" fill="url(#plasma-cyan)" filter="url(#glow-cyan)" />
        <ellipse cx="0" cy="-10" rx="5" ry="2.5" fill="#cffafe" />
        <ellipse cx="0" cy="-11" rx="5.5" ry="2.8" fill="#334155" />
      </g>

      {/* Floating Holographic 3D Atom Model */}
      <g transform="translate(0, -50)" filter="url(#glow-cyan)">
        <circle cx="0" cy="0" r="3" fill="#67e8f9" />
        <ellipse cx="0" cy="0" rx="11" ry="4" fill="none" stroke="#38bdf8" strokeWidth="1" transform="rotate(30)" />
        <ellipse cx="0" cy="0" rx="11" ry="4" fill="none" stroke="#38bdf8" strokeWidth="1" transform="rotate(-30)" />
        <circle cx="7" cy="3" r="1.2" fill="#fff" />
        <circle cx="-6" cy="-4" r="1.2" fill="#fff" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 4. KO'NGILOCHAR MINI-O'YINLAR MARKAZI (Cyber Arcade with KO'NGILOCHAR Sign)
// -----------------------------------------------------------------------------
export function KongilocharMarkaz3D({
  x,
  y,
  level = 1,
}: {
  x: number;
  y: number;
  level?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Octagonal Foundation Base */}
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill="#1e1b4b"
        stroke="#a855f7"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />

      {/* Arcade Pavilion Structure */}
      <g transform="translate(0, 2)">
        <path d="M -20 0 L 0 10 L 0 -20 L -20 -30 Z" fill="#3b0764" />
        <path d="M 0 10 L 20 0 L 20 -20 L 0 -10 Z" fill="#581c87" />
        <path d="M -20 -30 L 0 -20 L 20 -30 L 0 -40 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="0.8" />

        {/* Entrance Portal with Neon Green Archway */}
        <g transform="translate(0, 5)">
          <polygon points="-6 -3 0 0 0 9 -6 6" fill="#1e1b4b" />
          <polygon points="0 0 6 -3 6 6 0 9" fill="#2e1065" />
          <polyline
            points="-6 6 -6 -3 0 0 6 -3 6 6"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.6"
            filter="url(#glow-green)"
          />
        </g>
      </g>

      {/* Huge Marquee Sign on Top: "KO'NGILOCHAR" */}
      <g transform="translate(0, -34)" filter="url(#glow-magenta)">
        <polygon
          points="-22 -6 0 5 0 14 -22 3"
          fill="#701a75"
          stroke="#f472b6"
          strokeWidth="1.5"
        />
        <text
          x="-11"
          y="8"
          fill="#fdf2f8"
          fontSize="4.8"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.6"
          transform="skewY(26)"
        >
          KO&apos;NGILOCHAR
        </text>
      </g>

      {/* Glowing Diamond Emblem */}
      <g transform="translate(11, -32)" filter="url(#glow-gold)">
        <polygon points="0 -6 5 0 0 6 -5 0" fill="#f59e0b" stroke="#fde047" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2" fill="#ea580c" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 5. MODERN OFFICE TOWER (Apex Tech Tower / Skyscraper)
// -----------------------------------------------------------------------------
export function ModernTower3D({
  x,
  y,
  level = 1,
}: {
  x: number;
  y: number;
  level?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      <path d="M 0 -18 L 36 0 L 0 18 L -36 0 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />

      {/* Skyscraper Body */}
      <g transform="translate(0, -6)">
        <path d="M -14 0 L 0 7 L 0 -66 L -14 -73 Z" fill="url(#glass-front)" />
        <path d="M 0 7 L 16 -1 L 16 -74 L 0 -66 Z" fill="url(#glass-right)" />
        <path d="M -14 -73 L 0 -66 L 16 -74 L 2 -81 Z" fill="#0284c7" stroke="#38bdf8" />

        {/* Floor lines */}
        {[-8, -20, -32, -44, -56].map((h, i) => (
          <g key={i}>
            <line x1="-14" y1={h - 7} x2="0" y2={h} stroke="#0ea5e9" strokeWidth="0.8" opacity="0.75" />
            <line x1="0" y1={h} x2="16" y2={h - 8} stroke="#7dd3fc" strokeWidth="0.8" opacity="0.75" />
          </g>
        ))}

        {/* Antenna */}
        <line x1="2" y1="-81" x2="2" y2="-97" stroke="#94a3b8" strokeWidth="1.2" />
        <circle cx="2" cy="-97" r="1.5" fill="#ef4444" className="animate-pulse" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 6. EMPTY PLOT (Isometric Rhombus with Cyan Dashed Highlight)
// -----------------------------------------------------------------------------
export function EmptyPlot3D({
  x,
  y,
  gridX,
  gridY,
  onClick,
}: {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  onClick: () => void;
}) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      className="cursor-pointer group"
    >
      {/* Ground Foundation Tile */}
      <path
        d="M 0 -18 L 36 0 L 0 18 L -36 0 Z"
        fill="#0b1324"
        stroke="#06b6d4"
        strokeWidth="1"
        strokeDasharray="3 2"
        strokeOpacity="0.35"
        className="transition-all duration-200 group-hover:fill-cyan-950/40 group-hover:stroke-cyan-400 group-hover:stroke-opacity-90"
      />

      {/* Coordinate & Plus icon */}
      <g className="transition-transform duration-200 group-hover:scale-110">
        <circle
          cx="0"
          cy="0"
          r="6.5"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="0.8"
          className="group-hover:stroke-cyan-400 group-hover:fill-cyan-900/60"
        />
        <text
          x="0"
          y="3"
          fill="#94a3b8"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          className="group-hover:fill-cyan-300"
        >
          +
        </text>
      </g>

      <text
        x="0"
        y="11"
        fill="#475569"
        fontSize="6.5"
        fontFamily="monospace"
        textAnchor="middle"
        className="group-hover:fill-cyan-400"
      >
        ({gridX},{gridY})
      </text>
    </g>
  );
}
