"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { X, Sparkles, Trophy, Zap, Gamepad2 } from "lucide-react";

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWinBoost: (seconds: number) => void;
}

export function MiniGameModal({
  isOpen,
  onClose,
  onWinBoost,
}: MiniGameModalProps) {
  const { t } = useLanguage();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [hasWon, setHasWon] = useState(false);

  // 6 cards (3 pairs)
  const symbols = ["⚡", "🧬", "🏙️"];

  const initGame = () => {
    const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setHasWon(false);
  };

  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          setHasWon(true);
          onWinBoost(60);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-emerald-500/30 p-6 relative overflow-hidden shadow-2xl text-center space-y-4">
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Mini-o&apos;yin: 2x Boost yutish</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-300 relative z-10">
          Juft ramzlarni toping va shahar daromadiga <strong>60 soniyalik 2x Boost</strong> ga ega bo&apos;ling!
        </p>

        {/* Memory Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-2 relative z-10">
          {cards.map((symbol, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl text-2xl font-bold flex items-center justify-center transition-all duration-300 cursor-pointer border ${
                  isFlipped
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "bg-slate-900 border-white/10 hover:border-cyan-400/50 text-slate-500 hover:text-cyan-300"
                }`}
              >
                {isFlipped ? symbol : "❓"}
              </button>
            );
          })}
        </div>

        {/* Win Banner */}
        {hasWon && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold space-y-1 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>G&apos;alaba! 2x Boost Faollashtirildi! ⚡</span>
            </div>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Shaharga Qaytish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
