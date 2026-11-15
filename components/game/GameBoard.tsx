"use client";

import { useState } from "react";
import { useCityEngine, type InitialCityData } from "@/hooks/useCityEngine";
import { TopResourceBar } from "@/components/game/TopResourceBar";
import { LeftEconomyPanel } from "@/components/game/LeftEconomyPanel";
import { IsometricBoard } from "@/components/game/IsometricBoard";
import { RightPartnersPanel } from "@/components/game/RightPartnersPanel";
import { BuildModal } from "@/components/game/BuildModal";
import { UpgradeModal } from "@/components/game/UpgradeModal";
import { OfflineModal } from "@/components/game/OfflineModal";
import { BridgeDashboard } from "@/components/game/BridgeDashboard";
import { MiniGameModal } from "@/components/game/MiniGameModal";
import { GRID_SIZE } from "@/lib/game-constants";
import type { BuildingState } from "@/lib/game-engine";
import { useLanguage } from "@/lib/LanguageContext";
import {
  AlertCircle,
  Briefcase,
  Hammer,
  Gamepad2,
  Users,
  Cable,
  X,
} from "lucide-react";

interface GameBoardProps {
  username: string;
  initialData: InitialCityData;
}

export function GameBoard({ username, initialData }: GameBoardProps) {
  const {
    balance,
    buildings,
    bridgesCount,
    setBridgesCount,
    economy,
    science,
    researchedNodes,
    researchTech,
    boostMultiplier,
    boostSecondsLeft,
    triggerBoost,
    activeEvent,
    offlineReport,
    dismissOfflineReport,
    isActionPending,
    actionError,
    buyBuilding,
    upgradeBuilding,
    syncWithServer,
  } = useCityEngine(initialData);

  const { language } = useLanguage();

  // Modals & Mobile Drawers state
  const [selectedEmptyTile, setSelectedEmptyTile] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingState | null>(null);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState<boolean>(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState<boolean>(false);
  const [isEconomyDrawerOpen, setIsEconomyDrawerOpen] = useState<boolean>(false);
  const [isPartnersDrawerOpen, setIsPartnersDrawerOpen] = useState<boolean>(false);

  // Synchronize modal building state if building gets upgraded
  const activeSelectedBuilding = selectedBuilding
    ? buildings.find((b) => b.id === selectedBuilding.id) || null
    : null;

  const handleBridgeCountChanged = (count: number) => {
    setBridgesCount(count);
  };

  const handleOpenBuildForType = (type: string) => {
    // Find first empty tile
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!buildings.some((b) => b.grid_x === x && b.grid_y === y)) {
          setSelectedEmptyTile({ x, y });
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 relative overflow-x-hidden pb-16 lg:pb-0">
      {/* Background Cyber City Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Resource HUD (5 pill meters matching the screenshot) */}
      <TopResourceBar
        balance={balance}
        science={science}
        economy={economy}
        isActionPending={isActionPending}
        onSync={syncWithServer}
        rank={12}
        onOpenMobileMenu={() => setIsEconomyDrawerOpen(true)}
      />

      {/* Error Alert if any action failed */}
      {actionError && (
        <div className="max-w-xl mx-auto my-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 2. Main Metropolis Scene (3 Columns on Desktop, Full 3D Grid on Mobile) */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-1 sm:p-3 flex flex-col lg:flex-row items-start justify-between gap-3 relative z-10">
        {/* Left Column: Iqtisodiyot va Texnologiya (Hidden on mobile, accessible via bottom bar / drawer) */}
        <div className="hidden lg:block w-full lg:w-80 shrink-0">
          <LeftEconomyPanel
            balance={balance}
            science={science}
            efficiencyPercent={Math.round(economy.efficiency * 100)}
            researchedNodes={researchedNodes}
            onResearchTech={researchTech}
            onOpenBuildModalForType={handleOpenBuildForType}
          />
        </div>

        {/* Center Column: 3D Isometric Metropolis Board (Expands full screen on mobile!) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          <IsometricBoard
            buildings={buildings}
            efficiency={economy.efficiency}
            onSelectEmptyTile={(x, y) => setSelectedEmptyTile({ x, y })}
            onSelectBuilding={(building) => setSelectedBuilding(building)}
          />
        </div>

        {/* Right Column: Hamkorlar (Hidden on mobile, accessible via bottom bar / drawer) */}
        <div className="hidden lg:block w-full lg:w-80 shrink-0">
          <RightPartnersPanel
            bridgesCount={bridgesCount}
            onOpenBridgeModal={() => setIsBridgeModalOpen(true)}
            onOpenMiniGame={() => setIsMiniGameOpen(true)}
            boostMultiplier={boostMultiplier}
            boostSecondsLeft={boostSecondsLeft}
            currentUsername={username}
          />
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      {/* ------------------------------------------------------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-cyan-500/30 px-3 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
        {/* 1. Iqtisodiyot */}
        <button
          onClick={() => setIsEconomyDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-300 hover:text-cyan-300 transition active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            {language === "uz" ? "Iqtisod" : "Economy"}
          </span>
        </button>

        {/* 2. Qurish */}
        <button
          onClick={() => handleOpenBuildForType("")}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-300 hover:text-emerald-300 transition active:scale-95 cursor-pointer"
        >
          <Hammer className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-tight">
            {language === "uz" ? "Qurish" : "Build"}
          </span>
        </button>

        {/* 3. 2x Boost (Elevated Arcade Glow Button) */}
        <button
          onClick={() => setIsMiniGameOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 -mt-5 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)] active:scale-90 transition text-slate-950 font-black cursor-pointer"
        >
          <Gamepad2 className="w-5 h-5 text-white" />
          <span className="text-[9px] uppercase tracking-wider text-white font-black">
            {boostSecondsLeft > 0 ? `${boostSecondsLeft}s` : "2x Boost"}
          </span>
        </button>

        {/* 4. Hamkorlar */}
        <button
          onClick={() => setIsPartnersDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-300 hover:text-purple-300 transition active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Users className="w-5 h-5 text-purple-400" />
            {bridgesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-purple-500 text-[8px] font-bold text-white">
                {bridgesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            {language === "uz" ? "Hamkorlar" : "Alliances"}
          </span>
        </button>

        {/* 5. Ko'priklar */}
        <button
          onClick={() => setIsBridgeModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-slate-300 hover:text-amber-300 transition active:scale-95 cursor-pointer"
        >
          <Cable className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-tight">
            {language === "uz" ? "Ko'prik" : "Bridges"}
          </span>
        </button>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Slide-Up Drawer: Economy & Technology */}
      {/* ------------------------------------------------------------- */}
      {isEconomyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 lg:hidden">
          <div className="w-full max-h-[85vh] bg-slate-950/95 border-t border-cyan-500/40 rounded-t-3xl p-4 overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20 sticky top-0 bg-slate-950/95 z-10 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-sm font-black uppercase text-cyan-300 tracking-wider">
                  {language === "uz" ? "Iqtisodiyot va Texnologiya" : "Economy & Technology"}
                </h2>
              </div>
              <button
                onClick={() => setIsEconomyDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LeftEconomyPanel
              balance={balance}
              science={science}
              efficiencyPercent={Math.round(economy.efficiency * 100)}
              researchedNodes={researchedNodes}
              onResearchTech={researchTech}
              onOpenBuildModalForType={(type) => {
                setIsEconomyDrawerOpen(false);
                handleOpenBuildForType(type);
              }}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Mobile Slide-Up Drawer: Partners & Bridges */}
      {/* ------------------------------------------------------------- */}
      {isPartnersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 lg:hidden">
          <div className="w-full max-h-[85vh] bg-slate-950/95 border-t border-purple-500/40 rounded-t-3xl p-4 overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20 sticky top-0 bg-slate-950/95 z-10 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                <h2 className="text-sm font-black uppercase text-purple-300 tracking-wider">
                  {language === "uz" ? "Hamkorlar va Ko'priklar" : "Alliances & Bridges"}
                </h2>
              </div>
              <button
                onClick={() => setIsPartnersDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <RightPartnersPanel
              bridgesCount={bridgesCount}
              onOpenBridgeModal={() => {
                setIsPartnersDrawerOpen(false);
                setIsBridgeModalOpen(true);
              }}
              onOpenMiniGame={() => {
                setIsPartnersDrawerOpen(false);
                setIsMiniGameOpen(true);
              }}
              boostMultiplier={boostMultiplier}
              boostSecondsLeft={boostSecondsLeft}
              currentUsername={username}
            />
          </div>
        </div>
      )}

      {/* 3. Build Menu Modal */}
      {selectedEmptyTile && (
        <BuildModal
          tileCoordinates={selectedEmptyTile}
          balance={balance}
          isActionPending={isActionPending}
          onClose={() => setSelectedEmptyTile(null)}
          onBuild={buyBuilding}
        />
      )}

      {/* 4. Upgrade Modal */}
      {activeSelectedBuilding && (
        <UpgradeModal
          building={activeSelectedBuilding}
          balance={balance}
          isActionPending={isActionPending}
          onClose={() => setSelectedBuilding(null)}
          onUpgrade={upgradeBuilding}
        />
      )}

      {/* 5. Offline Revenue Claim Modal */}
      {offlineReport && (
        <OfflineModal
          report={offlineReport}
          onClaim={dismissOfflineReport}
        />
      )}

      {/* 6. Alliance & Bridge Dashboard */}
      <BridgeDashboard
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        onBridgeCountChanged={handleBridgeCountChanged}
      />

      {/* 7. Interactive Mini-Game Modal */}
      <MiniGameModal
        isOpen={isMiniGameOpen}
        onClose={() => setIsMiniGameOpen(false)}
        onWinBoost={triggerBoost}
      />
    </div>
  );
}
