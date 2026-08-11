"use client";

import { useState } from "react";
import { X, Mail, Sparkles, CheckCircle2, Gift, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { audioEngine } from "./AudioEngine";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailCaptureModal({ isOpen, onClose }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    audioEngine.playVictory();
    setIsSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#FF5722", "#8E24AA", "#FFD700"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111111] border border-[#FF5722]/40 p-6 sm:p-8 text-center shadow-2xl glow-primary">
        
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playClick(300);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#8E24AA] p-0.5 mx-auto mb-4">
              <div className="w-full h-full bg-[#111111] rounded-[14px] flex items-center justify-center">
                <Gift className="w-7 h-7 text-[#FF5722]" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2">Claim Mobile Rewards</h3>
            <p className="text-xs text-gray-300 mb-6">
              Enter your email to receive an instant Google Play redeem code for <span className="text-[#FFD700] font-bold">500 Bonus Cipher Coins</span> and early beta updates!
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#181818] border border-white/10 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#E60000] to-[#8E24AA] text-white font-bold font-mono text-sm shadow-xl shadow-[#FF5722]/30 hover:shadow-[#FF5722]/50 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Send Redeem Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-gray-500 font-mono mt-4">
              🔒 We respect your privacy. Zero spam. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#00E676]/20 border border-[#00E676]/50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#00E676]" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">REDEEM CODE SENT!</h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              We dispatched your Play Store promo code to <span className="text-[#FF5722] font-mono font-bold">{email}</span>. Open the email on your phone to claim 500 Cipher Coins!
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#181818] text-white font-mono text-xs font-bold border border-white/10 hover:border-white/20"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
