"use client";

import React from "react";

// Filter definitions for neon glows and 3D lighting
export function IsometricDefs() {
  return (
    <defs>
      {/* Neon Cyan Glow */}
      <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Neon Magenta / Pink Glow */}
      <filter id="glow-magenta" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gold Coin Glow */}
      <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Building Drop Shadow */}
      <filter id="building-shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="-8" dy="16" stdDeviation="10" floodColor="#000" floodOpacity="0.65" />
      </filter>

      {/* Linear Gradients for 3D Faces */}
      {/* Concrete / White Walls */}
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
        <stop offset="0%" stopColor="#4a044e" />
        <stop offset="100%" stopColor="#2e1065" />
      </linearGradient>
      <linearGradient id="store-right" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#701a75" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
      <linearGradient id="store-roof" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#86198f" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>

      {/* Green Roof / Lawn */}
      <linearGradient id="grass-roof" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#166534" />
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
    </defs>
  );
}

// -----------------------------------------------------------------------------
// 1. YASHIL TURAR-JOYLAR (Green Residential Houses, Garden & Apartment Complex)
// -----------------------------------------------------------------------------
export function YashilTurarJoylar3D({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Ground Lawn Platform */}
      <path
        d="M 0 -27 L 54 0 L 0 27 L -54 0 Z"
        fill="#14532d"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      {/* Apartment High-Rise (Back Left) */}
      <g transform="translate(-20, -18)">
        {/* Left Face (Shadowed) */}
        <path d="M -16 0 L 0 8 L 0 -50 L -16 -58 Z" fill="#0f172a" stroke="#1e293b" />
        {/* Right Face (Lit) */}
        <path d="M 0 8 L 18 -1 L 18 -59 L 0 -50 Z" fill="#1e293b" stroke="#334155" />
        {/* Roof Top */}
        <path d="M -16 -58 L 0 -50 L 18 -59 L 2 -67 Z" fill="#334155" stroke="#475569" />

        {/* Windows (Glowing cyan & warm yellow) */}
        {[-8, -20, -32, -44].map((yOffset, i) => (
          <g key={i}>
            <polygon
              points={`-12 ${yOffset - 3} -4 ${yOffset + 1} -4 ${yOffset + 6} -12 ${yOffset + 2}`}
              fill={i % 2 === 0 ? "#38bdf8" : "#fef08a"}
              opacity="0.85"
            />
            <polygon
              points={`4 ${yOffset + 1} 14 ${yOffset - 4} 14 ${yOffset + 1} 4 ${yOffset + 6}`}
              fill={i % 2 === 0 ? "#fef08a" : "#38bdf8"}
              opacity="0.85"
            />
          </g>
        ))}
      </g>

      {/* Residential Cottage 1 (Front Right) */}
      <g transform="translate(14, 2)">
        {/* Left Wall */}
        <path d="M -14 0 L 0 7 L 0 -16 L -14 -23 Z" fill="#f8fafc" />
        {/* Right Wall */}
        <path d="M 0 7 L 16 -1 L 16 -24 L 0 -16 Z" fill="#cbd5e1" />
        {/* Pitched Roof (Terracotta / Orange) */}
        <path d="M -16 -23 L 0 -15 L 0 -30 L -16 -37 Z" fill="#ea580c" />
        <path d="M 0 -15 L 18 -24 L 18 -38 L 0 -30 Z" fill="#c2410c" />
        {/* Cottage Window */}
        <polygon points="-10 -7 -3 -3 -3 -12 -10 -15" fill="#fef08a" opacity="0.9" />
        <polygon points="3 -4 12 -8 12 -17 3 -13" fill="#fef08a" opacity="0.9" />
      </g>

      {/* Residential Cottage 2 (Front Left) */}
      <g transform="translate(-14, 10)">
        {/* Walls */}
        <path d="M -12 0 L 0 6 L 0 -14 L -12 -20 Z" fill="#f1f5f9" />
        <path d="M 0 6 L 14 -1 L 14 -21 L 0 -14 Z" fill="#cbd5e1" />
        {/* Roof */}
        <path d="M -14 -20 L 0 -13 L 0 -26 L -14 -32 Z" fill="#0284c7" />
        <path d="M 0 -13 L 16 -20 L 16 -33 L 0 -26 Z" fill="#0369a1" />
        {/* Window */}
        <polygon points="-8 -5 -3 -2 -3 -9 -8 -12" fill="#fef08a" />
      </g>

      {/* Lush 3D Isometric Trees & Foliage */}
      {/* Tree 1 */}
      <g transform="translate(0, 16)">
        <rect x="-1" y="-5" width="2" height="6" fill="#78350f" />
        <circle cx="0" cy="-9" r="6" fill="#15803d" />
        <circle cx="-2" cy="-11" r="4.5" fill="#22c55e" opacity="0.9" />
        <circle cx="2" cy="-9" r="3.5" fill="#4ade80" opacity="0.7" />
      </g>
      {/* Tree 2 */}
      <g transform="translate(-32, -4)">
        <rect x="-1" y="-4" width="2" height="5" fill="#78350f" />
        <circle cx="0" cy="-8" r="5" fill="#166534" />
        <circle cx="-1" cy="-10" r="3.5" fill="#22c55e" />
      </g>
      {/* Tree 3 */}
      <g transform="translate(32, -8)">
        <rect x="-1" y="-4" width="2" height="5" fill="#78350f" />
        <circle cx="0" cy="-8" r="5" fill="#15803d" />
        <circle cx="1" cy="-10" r="4" fill="#4ade80" opacity="0.8" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 2. TIJORAT DO'KONLARI VA SANOAT ZAVODLARI (Cyberpunk Shopping & Factory)
// -----------------------------------------------------------------------------
export function TijoratSanoat3D({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Dark Concrete Base */}
      <path
        d="M 0 -27 L 54 0 L 0 27 L -54 0 Z"
        fill="#0f172a"
        stroke="#ec4899"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Main Commercial Store Building (Front) */}
      <g transform="translate(-4, 0)">
        {/* Left Wall */}
        <path d="M -24 0 L 0 12 L 0 -32 L -24 -44 Z" fill="url(#store-left)" />
        {/* Right Wall */}
        <path d="M 0 12 L 28 -2 L 28 -46 L 0 -32 Z" fill="url(#store-right)" />
        {/* Roof Top */}
        <path d="M -24 -44 L 0 -32 L 28 -46 L 4 -58 Z" fill="url(#store-roof)" />

        {/* NEON STORE SIGN "TIJORAT" (Prominent Magenta Glow) */}
        <g transform="translate(0, -32)">
          {/* Angled Signboard */}
          <polygon
            points="-22 -6 0 5 0 16 -22 5"
            fill="#831843"
            stroke="#f472b6"
            strokeWidth="1.5"
            filter="url(#glow-magenta)"
          />
          <text
            x="-11"
            y="9"
            fill="#fdf2f8"
            fontSize="7"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="1"
            transform="skewY(26)"
          >
            TIJORAT
          </text>
        </g>

        {/* Striped Canopy / Awning */}
        <polygon points="-22 1 0 12 0 8 -22 -3" fill="#f43f5e" />
        <polygon points="0 12 26 -1 26 -4 0 8" fill="#e11d48" />

        {/* Glowing Showcase Windows */}
        <polygon points="-20 4 -2 13 -2 19 -20 10" fill="#38bdf8" opacity="0.85" filter="url(#glow-cyan)" />
        <polygon points="2 13 24 2 24 8 2 19" fill="#fbcfe8" opacity="0.85" />
      </g>

      {/* Factory Section with Smokestacks (Back Right) */}
      <g transform="translate(22, -18)">
        {/* Factory Brick Base */}
        <path d="M -10 0 L 0 5 L 14 -2 L 4 -7 Z" fill="#334155" />
        <path d="M -10 0 L 0 5 L 0 -18 L -10 -23 Z" fill="#1e293b" />
        <path d="M 0 5 L 14 -2 L 14 -25 L 0 -18 Z" fill="#475569" />

        {/* 3 Industrial Smokestacks */}
        {[
          { cx: -4, cy: -20, h: 22 },
          { cx: 3, cy: -22, h: 26 },
          { cx: 10, cy: -25, h: 20 },
        ].map((stack, i) => (
          <g key={i}>
            <rect
              x={stack.cx - 2.5}
              y={stack.cy - stack.h}
              width="5"
              height={stack.h}
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth="0.8"
            />
            {/* Smokestack rim */}
            <ellipse
              cx={stack.cx}
              cy={stack.cy - stack.h}
              rx="2.5"
              ry="1.2"
              fill="#f97316"
              filter="url(#glow-gold)"
            />
          </g>
        ))}
      </g>

      {/* Floating 3D Golden Coins */}
      <g transform="translate(18, -60)" filter="url(#glow-gold)" className="animate-bounce-subtle">
        <circle cx="0" cy="0" r="7" fill="url(#coin-gold)" stroke="#fef08a" strokeWidth="1" />
        <text
          x="0"
          y="2.5"
          fill="#78350f"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
        >
          $
        </text>
      </g>
      <g transform="translate(30, -52)" filter="url(#glow-gold)">
        <circle cx="0" cy="0" r="5" fill="url(#coin-gold)" stroke="#fef08a" strokeWidth="0.8" />
        <text
          x="0"
          y="2"
          fill="#78350f"
          fontSize="5.5"
          fontWeight="bold"
          textAnchor="middle"
        >
          $
        </text>
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 3. ILM-FAN LABORATORIYASI (Science Lab with Holographic Atom & Plasma Tubes)
// -----------------------------------------------------------------------------
export function IlmFanLab3D({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* High-Tech Hex Base */}
      <path
        d="M 0 -27 L 54 0 L 0 27 L -54 0 Z"
        fill="#082f49"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />

      {/* Main Laboratory Facility Building */}
      <g transform="translate(0, 4)">
        {/* Left Angled Facade */}
        <path d="M -26 0 L 0 13 L 0 -28 L -26 -41 Z" fill="#0f172a" stroke="#1e293b" />
        {/* Right Angled Facade */}
        <path d="M 0 13 L 26 0 L 26 -28 L 0 -15 Z" fill="#0369a1" stroke="#0284c7" />
        {/* Roof Deck */}
        <path d="M -26 -41 L 0 -28 L 26 -41 L 0 -54 Z" fill="#0284c7" />

        {/* Cyan Glowing Tech Circuit Lines */}
        <polyline points="-22 -10 -12 -5 -12 -25" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8" />
        <polyline points="4 -5 18 -12 18 -30" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8" />
      </g>

      {/* Two Cylindrical Glowing Energy Tubes (Plasma Reactors) */}
      {/* Tube 1 (Left) */}
      <g transform="translate(-14, -20)">
        <ellipse cx="0" cy="8" rx="6" ry="3" fill="#0891b2" />
        <rect x="-6" y="-12" width="12" height="20" fill="url(#plasma-cyan)" filter="url(#glow-cyan)" />
        <ellipse cx="0" cy="-12" rx="6" ry="3" fill="#cffafe" />
        {/* Metal Caps */}
        <ellipse cx="0" cy="-13" rx="7" ry="3.5" fill="#334155" />
        <ellipse cx="0" cy="9" rx="7" ry="3.5" fill="#1e293b" />
      </g>

      {/* Tube 2 (Right) */}
      <g transform="translate(14, -20)">
        <ellipse cx="0" cy="8" rx="6" ry="3" fill="#0891b2" />
        <rect x="-6" y="-12" width="12" height="20" fill="url(#plasma-cyan)" filter="url(#glow-cyan)" />
        <ellipse cx="0" cy="-12" rx="6" ry="3" fill="#cffafe" />
        {/* Metal Caps */}
        <ellipse cx="0" cy="-13" rx="7" ry="3.5" fill="#334155" />
        <ellipse cx="0" cy="9" rx="7" ry="3.5" fill="#1e293b" />
      </g>

      {/* Floating Holographic 3D Atom Model with Orbital Rings */}
      <g transform="translate(0, -62)" filter="url(#glow-cyan)">
        {/* Nucleus */}
        <circle cx="0" cy="0" r="3.5" fill="#67e8f9" />
        {/* Orbit Ring 1 */}
        <ellipse cx="0" cy="0" rx="13" ry="5" fill="none" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(30)" />
        {/* Orbit Ring 2 */}
        <ellipse cx="0" cy="0" rx="13" ry="5" fill="none" stroke="#38bdf8" strokeWidth="1.2" transform="rotate(-30)" />
        {/* Orbit Ring 3 */}
        <ellipse cx="0" cy="0" rx="13" ry="4" fill="none" stroke="#67e8f9" strokeWidth="1" transform="rotate(90)" />
        {/* Electron Particles */}
        <circle cx="9" cy="4" r="1.5" fill="#fff" />
        <circle cx="-8" cy="-5" r="1.5" fill="#fff" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 4. KO'NGILOCHAR MINI-O'YINLAR MARKAZI (Cyber Arcade Pavilion)
// -----------------------------------------------------------------------------
export function KongilocharMarkaz3D({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Octagonal Foundation Base */}
      <path
        d="M 0 -27 L 54 0 L 0 27 L -54 0 Z"
        fill="#1e1b4b"
        stroke="#a855f7"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />

      {/* Cyber Arcade Main Pavilion */}
      <g transform="translate(0, 2)">
        {/* Left Side */}
        <path d="M -26 0 L 0 13 L 0 -26 L -26 -39 Z" fill="#3b0764" />
        {/* Right Side */}
        <path d="M 0 13 L 26 0 L 26 -26 L 0 -13 Z" fill="#581c87" />
        {/* Roof Plate */}
        <path d="M -26 -39 L 0 -26 L 26 -39 L 0 -52 Z" fill="#7e22ce" stroke="#c084fc" strokeWidth="1" />

        {/* Glowing Entrance Portal Arch */}
        <g transform="translate(0, 6)">
          <polygon points="-8 -4 0 0 0 12 -8 8" fill="#1e1b4b" />
          <polygon points="0 0 8 -4 8 8 0 12" fill="#2e1065" />
          {/* Neon Portal Glow */}
          <polyline
            points="-8 8 -8 -4 0 0 8 -4 8 8"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            filter="url(#glow-cyan)"
          />
        </g>
      </g>

      {/* Huge Marquee Sign on Top: "KO'NGILOCHAR" */}
      <g transform="translate(0, -42)" filter="url(#glow-magenta)">
        <polygon
          points="-28 -8 0 6 0 18 -28 4"
          fill="#701a75"
          stroke="#f472b6"
          strokeWidth="1.8"
        />
        <text
          x="-14"
          y="10"
          fill="#fdf2f8"
          fontSize="6"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.8"
          transform="skewY(26)"
        >
          KO&apos;NGILOCHAR
        </text>
      </g>

      {/* Arcade Mascot / Gaming Crest on Center Roof */}
      <g transform="translate(14, -40)" filter="url(#glow-gold)">
        {/* Glowing Diamond Crest */}
        <polygon points="0 -8 7 0 0 8 -7 0" fill="#f59e0b" stroke="#fde047" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#ea580c" />
      </g>

      {/* Neon Green Accent Rim */}
      <path
        d="M -24 3 L 0 15 L 24 3"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        filter="url(#glow-cyan)"
      />
    </g>
  );
}

// -----------------------------------------------------------------------------
// 5. MODERN OFFICE TOWER (Apex Tech Tower / Skyscraper)
// -----------------------------------------------------------------------------
export function ModernTower3D({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Base */}
      <path d="M 0 -27 L 54 0 L 0 27 L -54 0 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />

      {/* Skyscraper Body */}
      <g transform="translate(0, -10)">
        {/* Left Reflective Glass Wall */}
        <path d="M -18 0 L 0 9 L 0 -85 L -18 -94 Z" fill="url(#glass-front)" />
        {/* Right Reflective Glass Wall */}
        <path d="M 0 9 L 20 -1 L 20 -95 L 0 -85 Z" fill="url(#glass-right)" />
        {/* Rooftop */}
        <path d="M -18 -94 L 0 -85 L 20 -95 L 2 -104 Z" fill="#0284c7" stroke="#38bdf8" />

        {/* Horizontal Floor Spandrel Lines */}
        {[-10, -25, -40, -55, -70].map((h, i) => (
          <g key={i}>
            <line x1="-18" y1={h - 9} x2="0" y2={h} stroke="#0ea5e9" strokeWidth="1" opacity="0.7" />
            <line x1="0" y1={h} x2="20" y2={h - 10} stroke="#7dd3fc" strokeWidth="1" opacity="0.7" />
          </g>
        ))}

        {/* Rooftop Antenna Spire with Flashing Red Warning Light */}
        <line x1="2" y1="-104" x2="2" y2="-124" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="2" cy="-124" r="2" fill="#ef4444" className="animate-pulse" />
      </g>
    </g>
  );
}

// -----------------------------------------------------------------------------
// 6. EMPTY PLOT (Isometric Rhombus with dashed cyan hover highlight)
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
        d="M 0 -27 L 54 0 L 0 27 L -54 0 Z"
        fill="#0b1324"
        stroke="#06b6d4"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeOpacity="0.4"
        className="transition-all duration-200 group-hover:fill-cyan-950/40 group-hover:stroke-cyan-400 group-hover:stroke-opacity-90"
      />

      {/* Coordinate Label & Plus Icon */}
      <g className="transition-transform duration-200 group-hover:scale-110">
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="1"
          className="group-hover:stroke-cyan-400 group-hover:fill-cyan-900/60"
        />
        <text
          x="0"
          y="3.5"
          fill="#94a3b8"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          className="group-hover:fill-cyan-300"
        >
          +
        </text>
      </g>

      <text
        x="0"
        y="14"
        fill="#475569"
        fontSize="7.5"
        fontFamily="monospace"
        textAnchor="middle"
        className="group-hover:fill-cyan-400"
      >
        ({gridX},{gridY})
      </text>
    </g>
  );
}
