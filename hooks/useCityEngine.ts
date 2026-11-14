"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  calculateCityEconomy,
  calculateOfflineEarnings,
  type BuildingState,
  type CityCalculationResult,
} from "@/lib/game-engine";
import {
  buyBuildingAction,
  upgradeBuildingAction,
  syncBalanceAction,
} from "@/server-actions/game";

export interface InitialCityData {
  id: string;
  balance: number;
  population: number;
  last_sync_time: string | Date;
  buildings: BuildingState[];
  bridgesCount: number;
}

export interface OfflineReport {
  earned: number;
  elapsedSeconds: number;
  wasCapped: boolean;
}

export function useCityEngine(initialData: InitialCityData) {
  // Pure initial state matching SSR exactly to prevent hydration mismatch
  const [balance, setBalance] = useState<number>(initialData.balance);
  const [buildings, setBuildings] = useState<BuildingState[]>(initialData.buildings);
  const [bridgesCount, setBridgesCount] = useState<number>(initialData.bridgesCount);
  const [lastSyncTime, setLastSyncTime] = useState<string>(
    new Date(initialData.last_sync_time).toISOString()
  );

  // Offline earnings report modal state
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);

  // Loading/Syncing states
  const [isActionPending, setIsActionPending] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Guard to ensure offline calculation runs only once on client mount
  const hasCalculatedOffline = useRef(false);

  // Calculate live city economy stats (Workforce, Efficiency, $/sec, Bridge Boost)
  const economy: CityCalculationResult = useMemo(() => {
    return calculateCityEconomy(buildings, bridgesCount);
  }, [buildings, bridgesCount]);

  // --------------------------------------------------------------------------
  // 1. Initial Offline Calculation (Runs strictly once on client after hydration)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (hasCalculatedOffline.current) return;
    hasCalculatedOffline.current = true;

    const now = new Date();
    const offline = calculateOfflineEarnings(
      initialData.last_sync_time,
      now,
      economy.finalIncomePerSec
    );

    if (offline.elapsedSeconds > 2 && offline.earnedAmount > 0) {
      queueMicrotask(() => {
        setBalance((prev) => prev + offline.earnedAmount);
        setOfflineReport({
          earned: offline.earnedAmount,
          elapsedSeconds: offline.cappedSeconds,
          wasCapped: offline.wasCapped,
        });
      });

      // Synchronize verified offline earnings with the server
      syncBalanceAction().catch((err) =>
        console.warn("Background offline sync failed:", err)
      );
    }
  }, [initialData.last_sync_time, economy.finalIncomePerSec]);

  // --------------------------------------------------------------------------
  // 2. Pure UI State Idle Ticking (Every 1 Second)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const incomeRate = economy.finalIncomePerSec;
    if (incomeRate <= 0) return;

    const timer = setInterval(() => {
      setBalance((prev) => prev + incomeRate);
    }, 1000);

    return () => clearInterval(timer);
  }, [economy.finalIncomePerSec]);

  // --------------------------------------------------------------------------
  // 3. Beacon / beforeUnload DB Sync on Window Close
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/sync");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 4. Secure Actions: Buy Building
  // --------------------------------------------------------------------------
  const buyBuilding = useCallback(
    async (type: string, grid_x: number, grid_y: number) => {
      setIsActionPending(true);
      setActionError(null);

      try {
        const res = await buyBuildingAction(type, grid_x, grid_y);
        if (!res.success || !res.data) {
          setActionError(res.error || "Failed to purchase structure");
          return false;
        }

        // Apply server-verified balance and append building
        setBalance(res.data.balance);
        setBuildings((prev) => [...prev, res.data!.building]);
        setLastSyncTime(new Date().toISOString());
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error purchasing building";
        setActionError(msg);
        return false;
      } finally {
        setIsActionPending(false);
      }
    },
    []
  );

  // --------------------------------------------------------------------------
  // 5. Secure Actions: Upgrade Building
  // --------------------------------------------------------------------------
  const upgradeBuilding = useCallback(
    async (buildingId: string) => {
      setIsActionPending(true);
      setActionError(null);

      try {
        const res = await upgradeBuildingAction(buildingId);
        if (!res.success || !res.data) {
          setActionError(res.error || "Failed to upgrade structure");
          return false;
        }

        // Apply server-verified balance and update building level
        setBalance(res.data.balance);
        setBuildings((prev) =>
          prev.map((b) => (b.id === buildingId ? res.data!.building : b))
        );
        setLastSyncTime(new Date().toISOString());
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error upgrading building";
        setActionError(msg);
        return false;
      } finally {
        setIsActionPending(false);
      }
    },
    []
  );

  // --------------------------------------------------------------------------
  // 6. Manual Sync with Server
  // --------------------------------------------------------------------------
  const syncWithServer = useCallback(async () => {
    setIsActionPending(true);
    try {
      const res = await syncBalanceAction();
      if (res.success && res.data) {
        setBalance(res.data.balance);
        setLastSyncTime(res.data.last_sync_time);
      }
    } catch (err) {
      console.error("Manual sync failed:", err);
    } finally {
      setIsActionPending(false);
    }
  }, []);

  const dismissOfflineReport = useCallback(() => {
    setOfflineReport(null);
  }, []);

  return {
    balance,
    buildings,
    bridgesCount,
    setBridgesCount,
    lastSyncTime,
    economy,
    offlineReport,
    dismissOfflineReport,
    isActionPending,
    actionError,
    buyBuilding,
    upgradeBuilding,
    syncWithServer,
  };
}
