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
import { AlertCircle } from "lucide-react";

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

  // Modals state
  const [selectedEmptyTile, setSelectedEmptyTile] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingState | null>(null);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState<boolean>(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState<boolean>(false);

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
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 relative overflow-x-hidden">
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
      />

      {/* Error Alert if any action failed */}
      {actionError && (
        <div className="max-w-xl mx-auto my-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 2. Main 3-Column Metropolis Scene */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 flex flex-col lg:flex-row items-start justify-between gap-3 relative z-10">
        {/* Left Column: Iqtisodiyot va Texnologiya */}
        <LeftEconomyPanel
          balance={balance}
          science={science}
          efficiencyPercent={Math.round(economy.efficiency * 100)}
          researchedNodes={researchedNodes}
          onResearchTech={researchTech}
          onOpenBuildModalForType={handleOpenBuildForType}
        />

        {/* Center Column: 3D Isometric Metropolis Board */}
        <IsometricBoard
          buildings={buildings}
          efficiency={economy.efficiency}
          onSelectEmptyTile={(x, y) => setSelectedEmptyTile({ x, y })}
          onSelectBuilding={(building) => setSelectedBuilding(building)}
        />

        {/* Right Column: Hamkorlar */}
        <RightPartnersPanel
          bridgesCount={bridgesCount}
          onOpenBridgeModal={() => setIsBridgeModalOpen(true)}
          onOpenMiniGame={() => setIsMiniGameOpen(true)}
          boostMultiplier={boostMultiplier}
          boostSecondsLeft={boostSecondsLeft}
          currentUsername={username}
        />
      </main>

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
