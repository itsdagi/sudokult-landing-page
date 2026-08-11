"use client";

import { useState } from "react";
import { Server, Heart, Shield, CheckCircle2, Zap } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface SupportTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description: string;
}

const SUPPORT_TIERS: SupportTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    price: 3,
    description: "Powers ~1,000 matches",
  },
  {
    id: "sponsor",
    name: "Sponsor",
    price: 10,
    badge: "POPULAR",
    description: "Sustains servers for 1 week",
  },
  {
    id: "patron",
    name: "Patron",
    price: 25,
    description: "Funds new features & updates",
  },
];

const RECENT_BACKERS = [
  { name: "Marcus_V", amount: "$25" },
  { name: "GridRunner", amount: "$10" },
  { name: "VortexSolver", amount: "$50" },
  { name: "Elena_R", amount: "$3" },
];

export default function DonationSection() {
  const [selectedTierId, setSelectedTierId] = useState<string>("sponsor");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedTier = SUPPORT_TIERS.find((t) => t.id === selectedTierId);
  const activeAmount = customAmount ? Number(customAmount) || 0 : selectedTier?.price || 10;

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    setCustomAmount("");
    audioEngine.playSelectCell();
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setSelectedTierId("");
    audioEngine.playSelectCell();
  };

  const handleSubmitSupport = () => {
    if (activeAmount <= 0) return;
    audioEngine.playVictory();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section id="donate" className="section border-t border-white/[0.08] bg-[#0A0A0A]">
      <div className="container mx-auto px-6" style={{ maxWidth: "840px" }}>
        
        {/* Simple Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <span className="label text-[#DD5123] font-mono block mb-2" style={{ fontSize: "0.65rem" }}>
            COMMUNITY FUND
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Support Sudokult
          </h2>

          <p className="text-white/40 text-sm leading-relaxed">
            Sudokult is 100% free with zero ads. Your contribution helps cover server costs and ongoing development.
          </p>
        </div>

        {/* Minimal Server Fund Progress Bar */}
        <div className="mb-10 p-5 rounded-xl bg-[#111111] border border-white/[0.08]">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <span className="text-xs font-mono font-bold text-white uppercase">
              Server Fund Status
            </span>
            <span className="text-xs font-mono font-bold text-[#DD5123]">
              84% Funded ($2,520 / $3,000)
            </span>
          </div>

          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-[#DD5123] rounded-full" style={{ width: "84%" }} />
          </div>
        </div>

        {/* Support Selection Form */}
        <div className="space-y-6">
          
          {/* Frequency Tabs */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setFrequency("once");
                audioEngine.playSelectCell();
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors ${
                frequency === "once"
                  ? "bg-white text-[#0A0A0A]"
                  : "bg-[#121212] text-white/40 hover:text-white border border-white/5"
              }`}
            >
              One-Time
            </button>
            <button
              onClick={() => {
                setFrequency("monthly");
                audioEngine.playSelectCell();
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors ${
                frequency === "monthly"
                  ? "bg-[#DD5123] text-white"
                  : "bg-[#121212] text-white/40 hover:text-white border border-white/5"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Tier Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUPPORT_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id && !customAmount;

              return (
                <div
                  key={tier.id}
                  onClick={() => handleSelectTier(tier.id)}
                  className={`relative cursor-pointer rounded-xl p-4 transition-all ${
                    isSelected
                      ? "bg-[#161616] border-[#DD5123]"
                      : "bg-[#111111] hover:bg-[#141414] border-white/[0.08]"
                  }`}
                  style={{ borderWidth: "1px" }}
                >
                  {tier.badge && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#DD5123] text-white font-mono text-[8px] font-bold uppercase">
                      {tier.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{tier.name}</span>
                    <span className="text-lg font-extrabold font-mono text-white">
                      ${tier.price}
                    </span>
                  </div>

                  <p className="text-xs text-white/40 leading-snug">{tier.description}</p>
                </div>
              );
            })}
          </div>

          {/* Custom Amount Input */}
          <div className="p-4 rounded-xl bg-[#111111] border border-white/[0.08] flex items-center justify-between gap-4">
            <span className="text-xs text-white/50 font-mono">Custom Amount</span>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs">
                $
              </span>
              <input
                type="number"
                min="1"
                placeholder="Other"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full py-2 pl-7 pr-3 rounded-lg bg-[#0A0A0A] border text-white font-mono text-xs focus:outline-none focus:border-[#DD5123]"
                style={{
                  borderColor: customAmount ? "#DD5123" : "rgba(255,255,255,0.1)",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            {isSubmitted ? (
              <div className="w-full py-3.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you for supporting Sudokult! ♥</span>
              </div>
            ) : (
              <button
                onClick={handleSubmitSupport}
                className="w-full py-3.5 rounded-xl bg-[#DD5123] hover:bg-[#B8421C] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#DD5123]/20 flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>
                  Support — ${activeAmount} {frequency === "monthly" ? "/ Month" : ""}
                </span>
              </button>
            )}

            <p className="text-white/20 text-[11px] text-center mt-2.5 font-mono">
              Secure payment · Powered by Stripe / PayPal / Ko-fi
            </p>
          </div>

          {/* Minimal Recent Backers */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-white/30 flex-wrap">
            <span>Recent Backers:</span>
            {RECENT_BACKERS.map((b, idx) => (
              <span key={idx} className="text-white/60">
                {b.name} (<span className="text-[#DD5123]">{b.amount}</span>)
                {idx < RECENT_BACKERS.length - 1 && " •"}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
