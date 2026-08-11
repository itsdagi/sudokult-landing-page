"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-xs font-mono text-white/60 hover:text-white transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied Link!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-[#DD5123]" />
          <span>Share Article</span>
        </>
      )}
    </button>
  );
}
