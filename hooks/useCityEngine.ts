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

  // Science points and research
  const [science, setScience] = useState<number>(320);
  const [researchedNodes, setResearchedNodes] = useState<string[]>(["science_basics"]);

  // 2x Boost mechanic (from Mini-Game)
  const [boostMultiplier, setBoostMultiplier] = useState<number>(1.0);
  const [boostSecondsLeft, setBoostSecondsLeft] = useState<number>(0);

  // Dynamic Event (Festival)
  const [activeEvent, setActiveEvent] = useState<{
    title: string;
    description: string;
    happinessBoost: number;
  } | null>({
    title: "Festival boshlandi!",
    description: "+20% Aholi baxti",
    happinessBoost: 20,
  });

  // Offline earnings report modal state
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);

  // Loading/Syncing states
  const [isActionPending, setIsActionPending] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Guard to ensure offline calculation runs only once on client mount
  const hasCalculatedOffline = useRef(false);

  // Calculate live city economy stats (Workforce, Efficiency, $/sec, Bridge Boost, Happiness)
  const economy: CityCalculationResult = useMemo(() => {
    const eco = calculateCityEconomy(buildings, bridgesCount, boostMultiplier);
    if (activeEvent) {
      eco.happiness = Math.min(100, eco.happiness + activeEvent.happinessBoost);
    }
    return eco;
  }, [buildings, bridgesCount, boostMultiplier, activeEvent]);

  // Read saved science and tech from localStorage
  useEffect(() => {
    try {
      const savedScience = localStorage.getItem("citygame_science");
      if (savedScience) {
        setScience(Number(savedScience) || 320);
      }
      const savedTech = localStorage.getItem("citygame_tech");
      if (savedTech) {
        setResearchedNodes(JSON.parse(savedTech));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save science to localStorage periodically
  useEffect(() => {
    try {
      localStorage.setItem("citygame_science", science.toString());
      localStorage.setItem("citygame_tech", JSON.stringify(researchedNodes));
    } catch {
      // Ignore
    }
  }, [science, researchedNodes]);

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
    const scienceRate = economy.sciencePerSec > 0 ? economy.sciencePerSec : 1;

    const timer = setInterval(() => {
      setBalance((prev) => prev + incomeRate);
      setScience((prev) => prev + scienceRate);

      // Decrement boost timer if active
      setBoostSecondsLeft((prev) => {
        if (prev <= 1) {
          setBoostMultiplier(1.0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [economy.finalIncomePerSec, economy.sciencePerSec]);

  // --------------------------------------------------------------------------
  // 3. Trigger 2x Boost (From Mini-game)
  // --------------------------------------------------------------------------
  const triggerBoost = useCallback((durationSeconds: number = 60) => {
    setBoostMultiplier(2.0);
    setBoostSecondsLeft(durationSeconds);
  }, []);

  // --------------------------------------------------------------------------
  // 4. Research Tech Node
  // --------------------------------------------------------------------------
  const researchTech = useCallback(
    (nodeId: string, cost: number) => {
      if (science < cost || researchedNodes.includes(nodeId)) {
        return false;
      }
      setScience((prev) => prev - cost);
      setResearchedNodes((prev) => [...prev, nodeId]);
      return true;
    },
    [science, researchedNodes]
  );

  // --------------------------------------------------------------------------
  // 5. Beacon / beforeUnload DB Sync on Window Close
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
  // 6. Secure Actions: Buy Building
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
  // 7. Secure Actions: Upgrade Building
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
  // 8. Manual Sync with Server
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
    science,
    researchedNodes,
    researchTech,
    boostMultiplier,
    boostSecondsLeft,
    triggerBoost,
    activeEvent,
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
