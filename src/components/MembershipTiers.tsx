"use client";

import { useState } from "react";
import { Check, Shield, Crown, Sparkles, Zap } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface MembershipTiersProps {
  onOpenInitiation: () => void;
}

export default function MembershipTiers({ onOpenInitiation }: MembershipTiersProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggleBilling = () => {
    audioEngine.playClick(450);
    setIsAnnual(!isAnnual);
  };

  return (
    <section id="tiers" className="py-24 bg-[#070709] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono mb-4">
            <Crown className="w-3.5 h-3.5" />
            <span>SANCTUM MEMBERSHIP TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            ASCEND THE <span className="text-gold-gradient">RITUAL RANKS</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Choose your tier in the Order. Unlock variant puzzles, candidate logic tools, and global grandmaster standing.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-mono ${!isAnnual ? "text-white font-bold" : "text-gray-400"}`}>
              Monthly Rites
            </span>
            <button
              onClick={handleToggleBilling}
              className="w-14 h-8 rounded-full bg-white/10 p-1 relative transition-colors focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-amber-400 transition-transform ${
                  isAnnual ? "translate-x-6 bg-amber-400 shadow-md shadow-amber-400/40" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span className={`text-sm font-mono flex items-center gap-1.5 ${isAnnual ? "text-amber-400 font-bold" : "text-gray-400"}`}>
              Annual Initiation
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] uppercase font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Seeker */}
          <div className="p-8 rounded-3xl bg-glass-card border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Seeker</h3>
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-mono">
                  Initiate Level
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white font-mono">$0</span>
                <span className="text-gray-400 text-sm font-mono"> / forever</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Essential tools for daily Sudoku solvers seeking clean, unadulterated logic puzzles.
              </p>

              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Daily 00:00 UTC Sacred Grid</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Zero-delay candidate pencil engine</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Global time leaderboards</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500 line-through">
                  <span>Variant Grid Vault (Killer, Thermo)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick(500);
                onOpenInitiation();
              }}
              className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-white font-bold text-sm font-mono transition-all"
            >
              Join as Seeker
            </button>
          </div>

          {/* Tier 2: Hierophant (Featured / Most Popular) */}
          <div className="p-8 rounded-3xl bg-glass-card border-2 border-amber-500/50 shadow-2xl glow-gold flex flex-col justify-between relative scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold font-mono uppercase tracking-wider shadow-md">
              Most Revered
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 pt-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Hierophant <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
                  Adept Rank
                </span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-gold-gradient font-mono">
                  ${isAnnual ? "7" : "9"}
                </span>
                <span className="text-gray-400 text-sm font-mono"> / month</span>
              </div>
              <p className="text-sm text-gray-300 mb-6">
                For serious solvers who demand variant grids, smart pattern highlighting, and deep codex analytics.
              </p>

              <ul className="space-y-3 mb-8 text-sm text-gray-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">All Seeker Features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Variant Grid Vault (Killer, Thermo, Miracle)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Interactive Pattern Detector (X-Wing, Swordfish)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Unlimited Oracle Hints & Analysis</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                audioEngine.playVictory();
                onOpenInitiation();
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-sm font-mono shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
            >
              Claim Hierophant Pass
            </button>
          </div>

          {/* Tier 3: Sovereign of the Void */}
          <div className="p-8 rounded-3xl bg-glass-card border border-white/10 flex flex-col justify-between hover:border-purple-500/30 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Sovereign</h3>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono">
                  Grandmaster
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-purple-400 font-mono">
                  ${isAnnual ? "19" : "24"}
                </span>
                <span className="text-gray-400 text-sm font-mono"> / month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                The ultimate tier for grid masters who want custom puzzle generation, mentorship, and physical cipher memorabilia.
              </p>

              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>All Hierophant Features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>Infinite Custom Difficulty Puzzle Generator</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>1-on-1 World Champion Technique Review</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>Physical Metal Sudokult Cipher Emblem</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick(650);
                onOpenInitiation();
              }}
              className="w-full py-3.5 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 font-bold text-sm font-mono transition-all"
            >
              Become Sovereign
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
