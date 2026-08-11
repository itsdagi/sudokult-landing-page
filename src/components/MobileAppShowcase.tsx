"use client";

import { Smartphone, Zap, WifiOff, Bell, Moon, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import PlayStoreBadge from "./PlayStoreBadge";
import { audioEngine } from "./AudioEngine";

const APP_FEATURES = [
  {
    icon: Zap,
    title: "Gesture Candidate Engine",
    description: "Swipe across cells to rapidly toggle pencil candidate marks with zero input latency and crisp micro-haptic feedback.",
    badge: "Mobile Innovation",
  },
  {
    icon: WifiOff,
    title: "100% Offline Ritual Mode",
    description: "Daily rites and 1,000+ variant grids are cached locally. Play seamlessly on flights, subways, or remote retreats.",
    badge: "Zero Connectivity Req.",
  },
  {
    icon: Bell,
    title: "00:00 UTC Push Drop",
    description: "Get notified the instant the new daily global puzzle releases at midnight UTC. Compete on global time leaderboards.",
    badge: "Global Sync",
  },
  {
    icon: Moon,
    title: "OLED Night Ritual Theme",
    description: "Pure #080808 obsidian dark theme engineered to minimize blue light strain during late-night puzzle sessions.",
    badge: "Eye Protection",
  },
  {
    icon: Layers,
    title: "Thermo & Killer Grid Vault",
    description: "Expand beyond standard 9x9 grids. Access Thermo Sudoku, Killer Sudoku, and Hypersudoku variants on mobile.",
    badge: "Variant Vault",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Guess Logic Guarantee",
    description: "Every single puzzle in the mobile app is algorithmically verified to be solvable via pure mathematical deduction.",
    badge: "Pure Logic",
  },
];

export default function MobileAppShowcase() {
  return (
    <section id="mobile-app" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#8E24AA]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8E24AA]/10 border border-[#8E24AA]/30 text-[#E1BEE7] text-xs font-mono mb-4">
            <Smartphone className="w-3.5 h-3.5 text-[#8E24AA]" />
            <span>BUILT FOR ANDROID SOLVERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            THE ULTIMATE <span className="text-accent-gradient">MOBILE EXPERIENCE</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Engineered from the ground up for high-speed Android solving. Discover why Sudokult has a 4.9★ rating on the Google Play Store.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {APP_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-surface-card border border-white/10 hover:border-[#FF5722]/40 transition-all hover:scale-[1.02] group"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5722]/10 border border-[#FF5722]/30 flex items-center justify-center text-[#FF5722] group-hover:bg-[#FF5722] group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono text-[10px]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF5722] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Download Banner Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#181818] via-[#111111] to-[#181818] border border-[#FF5722]/30 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl glow-primary">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Ready to Ascend on Mobile?
            </h3>
            <p className="text-sm text-gray-300">
              Download Sudokult today on Google Play Store. Join 10,000+ initiated solvers in daily logic rites.
            </p>
          </div>

          <div className="shrink-0">
            <PlayStoreBadge variant="compact" />
          </div>
        </div>

      </div>
    </section>
  );
}
