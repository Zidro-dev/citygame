"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, type AuthActionResult } from "@/server-actions/auth";
import {
  Lock,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  Coins,
  Users,
  Grid,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    registerAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/city");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Found City Charter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Claim your 5x5 territory and initiate economic development
          </p>
        </div>

        {/* Starter Perks Preview Badge */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Charter Inclusions</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <Coins className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <div className="font-semibold text-white">$500</div>
              <div className="text-[10px] text-slate-400">Capital</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <Users className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
              <div className="font-semibold text-white">10</div>
              <div className="text-[10px] text-slate-400">Citizens</div>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <Grid className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <div className="font-semibold text-white">5x5</div>
              <div className="text-[10px] text-slate-400">Land Plot</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mayor Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="username"
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
                placeholder="Choose mayor name (e.g. CyberVanguard)"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Passcode (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] transition shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Founding City & Constructing Hubs...</span>
              </>
            ) : (
              <>
                <span>Establish Metropolis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Switch */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
          Already registered as Mayor?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
          >
            Return to City Console
          </Link>
        </div>
      </div>
    </div>
  );
}
