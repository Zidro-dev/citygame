"use client";

import { useState, useEffect } from "react";
import {
  getBridgesAction,
  sendBridgeRequestAction,
  acceptBridgeRequestAction,
  rejectBridgeRequestAction,
  type BridgeItem,
} from "@/server-actions/bridge";
import { MAX_BRIDGES, BRIDGE_BONUS_PERCENT } from "@/lib/game-constants";
import {
  X,
  Network,
  Send,
  Check,
  Trash2,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";

interface BridgeDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onBridgeCountChanged?: (count: number) => void;
}

export function BridgeDashboard({
  isOpen,
  onClose,
  onBridgeCountChanged,
}: BridgeDashboardProps) {
  const [targetUsername, setTargetUsername] = useState<string>("");
  const [activeBridges, setActiveBridges] = useState<BridgeItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<BridgeItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<BridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Load bridges on opening
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      getBridgesAction()
        .then((res) => {
          if (isMounted && res.success && res.data) {
            setActiveBridges(res.data.activeBridges);
            setIncomingRequests(res.data.incomingRequests);
            setOutgoingRequests(res.data.outgoingRequests);
            onBridgeCountChanged?.(res.data.activeBridges.length);
          }
        })
        .catch((err) => console.error("Failed to load bridges:", err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, onBridgeCountChanged]);

  if (!isOpen) return null;

  const totalBonusPercent = activeBridges.length * (BRIDGE_BONUS_PERCENT * 100);

  const reloadBridges = async () => {
    const res = await getBridgesAction();
    if (res.success && res.data) {
      setActiveBridges(res.data.activeBridges);
      setIncomingRequests(res.data.incomingRequests);
      setOutgoingRequests(res.data.outgoingRequests);
      onBridgeCountChanged?.(res.data.activeBridges.length);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await sendBridgeRequestAction(targetUsername.trim());
      if (res.success) {
        setMessage({ text: `Bridge invitation dispatched to ${targetUsername}!`, isError: false });
        setTargetUsername("");
        await reloadBridges();
      } else {
        setMessage({ text: res.error || "Failed to dispatch request", isError: true });
      }
    } catch {
      setMessage({ text: "Network error sending bridge proposal", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await acceptBridgeRequestAction(id);
      if (res.success) {
        await reloadBridges();
      } else {
        setMessage({ text: res.error || "Could not accept bridge", isError: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await rejectBridgeRequestAction(id);
      if (res.success) {
        await reloadBridges();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-white/15 p-6 relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Intercity Tourism Bridge Network
              </h3>
              <p className="text-xs text-slate-400">
                Connect borders with up to 9 player cities for compounding tourism multipliers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tourism Bonus Banner */}
        <div className="py-4 relative z-10">
          <div className="glass-card p-4 rounded-2xl border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-slate-900/40 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Active Alliance Bonus</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                +{totalBonusPercent}%{" "}
                <span className="text-xs font-normal text-slate-300">Global Revenue Boost</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Each active bridge provides +5% tourism multiplier to all commercial zones.
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Bridge Capacity</div>
              <div className="text-xl font-bold font-mono text-purple-300">
                {activeBridges.length} / {MAX_BRIDGES}
              </div>
              <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(activeBridges.length / MAX_BRIDGES) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`mb-3 p-3 rounded-xl text-xs flex items-center gap-2 relative z-10 ${
              message.isError
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Send Bridge Request Form */}
        <form onSubmit={handleSend} className="flex gap-2 mb-4 relative z-10">
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="Enter neighboring mayor username..."
            disabled={activeBridges.length >= MAX_BRIDGES || isSubmitting}
            className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={
              !targetUsername.trim() || activeBridges.length >= MAX_BRIDGES || isSubmitting
            }
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Propose Bridge</span>
          </button>
        </form>

        {/* Bridge Connections List Tabs & Content */}
        <div className="overflow-y-auto space-y-4 pr-1 relative z-10 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span className="text-xs">Scanning territory network...</span>
            </div>
          ) : (
            <>
              {/* 1. Incoming Requests (Action Required) */}
              {incomingRequests.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Incoming Bridge Proposals ({incomingRequests.length})</span>
                  </div>
                  <div className="space-y-2">
                    {incomingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="glass-card p-3 rounded-xl border-amber-500/20 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">
                              Mayor {req.partnerUsername}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Proposes a cross-border tourism bridge
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(req.id)}
                            disabled={isSubmitting || activeBridges.length >= MAX_BRIDGES}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Active Bridges */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Active Tourism Alliances ({activeBridges.length})</span>
                </div>

                {activeBridges.length === 0 ? (
                  <div className="p-6 rounded-2xl glass-card text-center text-xs text-slate-400">
                    No active bridges yet. Send proposals to neighboring mayors above to unlock the
                    +5% tourism boost per bridge!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeBridges.map((bridge) => (
                      <div
                        key={bridge.id}
                        className="glass-card p-3 rounded-xl border border-purple-500/20 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="p-2 rounded-lg bg-purple-500/15 text-purple-300 shrink-0">
                            <Network className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              Mayor {bridge.partnerUsername}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                              +5% Tourism Boost
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReject(bridge.id)}
                          disabled={isSubmitting}
                          title="Sever Bridge Alliance"
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Outgoing Pending Requests */}
              {outgoingRequests.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Dispatched Proposals Awaiting Response ({outgoingRequests.length})
                  </div>
                  <div className="space-y-2">
                    {outgoingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="glass-card p-2.5 rounded-xl border-white/5 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300">
                          Proposal sent to <strong>Mayor {req.partnerUsername}</strong>
                        </span>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
