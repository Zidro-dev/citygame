"use client";

import { useState } from "react";
import { useCityEngine, type InitialCityData } from "@/hooks/useCityEngine";
import { TopBar } from "@/components/game/TopBar";
import { CityGrid } from "@/components/game/CityGrid";
import { BuildModal } from "@/components/game/BuildModal";
import { UpgradeModal } from "@/components/game/UpgradeModal";
import { OfflineModal } from "@/components/game/OfflineModal";
import { BridgeDashboard } from "@/components/game/BridgeDashboard";
import type { BuildingState } from "@/lib/game-engine";
import { AlertCircle, AlertTriangle, Network, ShieldCheck } from "lucide-react";

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

  // Synchronize modal building state if the building gets upgraded
  const activeSelectedBuilding = selectedBuilding
    ? buildings.find((b) => b.id === selectedBuilding.id) || null
    : null;

  const isDeficit = economy.efficiency < 1.0 && economy.totalRequiredPopulation > 0;

  const handleBridgeCountChanged = (count: number) => {
    setBridgesCount(count);
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      {/* 1. Glassmorphism Sticky Top-Bar */}
      <TopBar
        username={username}
        balance={balance}
        economy={economy}
        isActionPending={isActionPending}
        onSync={syncWithServer}
        onOpenBridgeModal={() => setIsBridgeModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Error Alert if any action failed */}
        {actionError && (
          <div className="glass-card p-3.5 rounded-2xl bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Economic Advisory Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Workforce status */}
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 transition ${
              isDeficit
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "glass-card border-white/5 text-slate-300"
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isDeficit
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-emerald-500/15 text-emerald-300"
              }`}
            >
              {isDeficit ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="font-bold">
                {isDeficit
                  ? `Labor Deficit Detected (${Math.round(economy.efficiency * 100)}% Efficiency)`
                  : "Workforce Fully Staffed (100% Efficiency)"}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isDeficit
                  ? `Your commercial centers need ${
                      economy.totalRequiredPopulation - economy.totalPopulation
                    } more citizens to generate maximum revenue.`
                  : "All commercial zones are operating at peak economic output."}
              </p>
            </div>
          </div>

          {/* Tourism status */}
          <div className="glass-card p-3.5 rounded-2xl border-white/5 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">
                  Tourism Bridge Multiplier: +{Math.round((economy.bridgeMultiplier - 1) * 100)}%
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {bridgesCount < 9
                    ? `Connect up to ${9 - bridgesCount} more player cities for +5% bonus each.`
                    : "Maximum 9 bridges connected! +45% peak tourism bonus active."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBridgeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer transition shrink-0"
            >
              Manage
            </button>
          </div>
        </div>

        {/* 3. Interactive City Grid */}
        <CityGrid
          buildings={buildings}
          onSelectEmptyTile={(x, y) => setSelectedEmptyTile({ x, y })}
          onSelectBuilding={(building) => setSelectedBuilding(building)}
        />
      </main>

      {/* 4. Build Menu Modal */}
      {selectedEmptyTile && (
        <BuildModal
          tileCoordinates={selectedEmptyTile}
          balance={balance}
          isActionPending={isActionPending}
          onClose={() => setSelectedEmptyTile(null)}
          onBuild={buyBuilding}
        />
      )}

      {/* 5. Upgrade Modal */}
      {activeSelectedBuilding && (
        <UpgradeModal
          building={activeSelectedBuilding}
          balance={balance}
          isActionPending={isActionPending}
          onClose={() => setSelectedBuilding(null)}
          onUpgrade={upgradeBuilding}
        />
      )}

      {/* 6. Offline Revenue Claim Modal */}
      {offlineReport && (
        <OfflineModal
          report={offlineReport}
          onClaim={dismissOfflineReport}
        />
      )}

      {/* 7. Alliance & Bridge Dashboard */}
      <BridgeDashboard
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        onBridgeCountChanged={handleBridgeCountChanged}
      />
    </div>
  );
}
