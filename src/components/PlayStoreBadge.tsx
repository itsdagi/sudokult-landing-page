"use client";

import { useState } from "react";
import { Star, QrCode, Smartphone, X, ShieldCheck } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface PlayStoreBadgeProps {
  variant?: "hero" | "compact" | "banner";
}

export default function PlayStoreBadge({ variant = "hero" }: PlayStoreBadgeProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleOpenQr = () => {
    audioEngine.playClick(600);
    setIsQrOpen(true);
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2.5 w-full">
        {/* Primary Play Store Direct Download Button */}
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioEngine.playVictory()}
          className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-[#DD5123] hover:bg-[#B8421C] text-white font-bold transition-all duration-200 cursor-pointer shadow-md shadow-[#DD5123]/20"
        >
          {/* Play Store SVG Icon */}
          <svg className="w-5 h-5 text-white fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L18.81,13.97C19.44,13.61 19.44,12.39 18.81,12.03L16.81,10.88L14.81,12.88L16.81,15.12M4.54,1.44L14.81,11.71L12.56,13.96L2.44,3.84L4.54,1.44M4.54,22.56L2.44,20.16L12.56,10.04L14.81,12.29L4.54,22.56Z" />
          </svg>

          <div className="flex flex-col text-left">
            <span className="text-[8px] font-mono text-white/80 uppercase tracking-widest leading-none">
              GET IT ON
            </span>
            <span className="text-xs font-extrabold font-sans text-white leading-tight">
              Google Play
            </span>
          </div>
        </a>

        {/* QR Code Scan Button */}
        <button
          onClick={handleOpenQr}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all text-xs font-mono cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#DD5123]" />
          <span>Scan QR</span>
        </button>
      </div>

      {/* Live Solvers & Rating Pill — Fits cleanly on its own row */}
      {variant !== "compact" && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/70 self-start">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-bold text-white">4.9 ★</span>
          <span className="text-white/20">•</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            10,482 Active
          </span>
        </div>
      )}

      {/* Minimalist QR Modal */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#111111] border border-white/10 p-6 text-center shadow-2xl">
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#DD5123]/20 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-5 h-5 text-[#DD5123]" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Instant App Install</h3>
            <p className="text-xs text-white/40 mb-5">
              Point your phone camera at the QR code below to open Google Play Store.
            </p>

            {/* Generated QR Code Canvas */}
            <div className="p-3 bg-white rounded-xl mx-auto w-44 h-44 flex items-center justify-center shadow-inner mb-4">
              <div className="grid grid-cols-7 gap-1 w-full h-full p-2 bg-[#0A0A0A] rounded-md">
                {[...Array(49)].map((_, i) => {
                  const isCorner =
                    i < 3 ||
                    (i >= 4 && i < 7) ||
                    (i >= 42 && i < 45) ||
                    i === 14 ||
                    i === 21 ||
                    i === 28 ||
                    i === 35;
                  return (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        isCorner || i % 3 === 0 ? "bg-[#DD5123]" : i % 2 === 0 ? "bg-white/80" : "bg-white"
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Google Play Store Link</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
