"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

type Status = "idle" | "submitting" | "success" | "error";

export default function EarlyAccessCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#DD5123", "#8E24AA", "#FFD700"],
      });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-6" style={{ maxWidth: "680px" }}>
        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-6 py-8 sm:px-10 sm:py-10 text-center">
          {/* Small label */}
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DD5123]" />
            <span className="label text-white/40" style={{ letterSpacing: "0.18em" }}>
              Early Access // Beta
            </span>
          </div>

          {status === "success" ? (
            <div className="mt-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                You&apos;re on the list!
              </h2>
              <p className="mt-2 text-sm text-white/45">
                Watch your inbox — your beta invite + 500 Cipher Coins are on the way.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Enter your email for <span className="text-[#DD5123]">early testing</span>
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0D0D0D] border border-white/[0.12] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DD5123] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="shrink-0 px-6 py-3 rounded-xl bg-[#DD5123] text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Get Early Access"}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-3 text-xs text-[#FF6B6B]">{message}</p>
              )}

              <p className="mt-5 text-xs text-white/35">
                10,000+ players waiting&nbsp;&nbsp;·&nbsp;&nbsp;No spam&nbsp;&nbsp;·&nbsp;&nbsp;Free
                forever
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
