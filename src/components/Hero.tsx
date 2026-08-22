"use client";

import { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

type EarlyAccessStatus = "idle" | "submitting" | "success" | "error";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<EarlyAccessStatus>("idle");
  const [message, setMessage] = useState("");

  const handleEarlyAccess = async (e: React.FormEvent) => {
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
        particleCount: 180,
        spread: 100,
        origin: { y: 0.45 },
        colors: ["#DD5123", "#8E24AA", "#FFD700"],
      });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Faint ambient background — single orange orb, not loud */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "35%",
          left: "55%",
          width: "600px",
          height: "600px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(221,81,35,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="container mx-auto px-8" style={{ maxWidth: "1140px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[80vh]">

          {/* Left — Text */}
          <div className="flex flex-col justify-center">

            {/* Category label */}
            <div className="flex items-center gap-3 mb-10">
              <span
                className="w-2 h-2 rounded-full animate-live"
                style={{ background: "#DD5123" }}
              />
              <span className="label text-white/40">Multiplayer Magic Sudoku</span>
            </div>

            {/* Main headline */}
            <h1
              className="heading-xl text-white mb-8"
              style={{ lineHeight: 0.95 }}
            >
              Solve.
              <br />
              <span style={{ color: "#DD5123" }}>Cast.</span>
              <br />
              Win.
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/45 leading-relaxed mb-14"
              style={{ fontSize: "1.0625rem", maxWidth: "460px" }}
            >
              The world&apos;s first real-time multiplayer Sudoku. Distract opponents with
              magic tricks — shake their board, cast smoke, scramble their notes.
            </p>

            {/* Play Store CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-16">
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "#DD5123", letterSpacing: "0.01em" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M3.18 23.76c.37.21.8.22 1.18.04l13.27-7.65-2.83-2.83-11.62 10.44zm-1.53-20.7A1.5 1.5 0 0 0 1.5 4.5v15a1.5 1.5 0 0 0 .15.66l11.76-10.58L1.65 3.06zM20.32 10.5l-2.9-1.67-3.2 2.88 3.2 2.88 2.92-1.68a1.5 1.5 0 0 0 0-2.41zM4.36.2C3.98.02 3.55.03 3.18.24L14.8 10.68l2.83-2.83L4.36.2z" />
                </svg>
                Download on Google Play
              </a>
              <span className="label text-white/25">Free · Android</span>
            </div>

            {/* Early testing email capture */}
            <div className="relative float-slow" style={{ maxWidth: "540px" }}>
              <div className="early-access-card relative rounded-3xl p-6 sm:p-8 glow-orange">
                {/* Shimmer sweep across the panel */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1/2 animate-shimmer"
                    style={{
                      background:
                        "linear-gradient(100deg, transparent, rgba(255,255,255,0.06), transparent)",
                    }}
                  />
                </div>

                {status === "success" ? (
                  <div className="relative text-center py-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                      style={{
                        background: "rgba(221,81,35,0.12)",
                        border: "1px solid rgba(221,81,35,0.3)",
                      }}
                    >
                      <span className="text-3xl">🎉</span>
                    </div>
                    <h3 className="heading-md text-white mb-2">You&apos;re on the list!</h3>
                    <p className="text-white/50 text-sm mb-1">
                      Early access is reserved for{" "}
                      <span className="text-white font-bold">{email}</span>.
                    </p>
                    <p className="text-xs text-white/35">
                      Watch your inbox for your beta invite + 500 Cipher Coins.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Beta badge */}
                    <div className="inline-flex items-center gap-2 mb-6">
                      <span
                        className="w-2 h-2 rounded-full animate-live"
                        style={{ background: "#DD5123" }}
                      />
                      <span className="label text-white/40" style={{ letterSpacing: "0.18em" }}>
                        Early Access // Beta
                      </span>
                    </div>

                    <h3
                      className="text-white font-extrabold mb-6"
                      style={{ fontSize: "1.75rem", lineHeight: 1.08, letterSpacing: "-0.02em" }}
                    >
                      Enter your email for{" "}
                      <span style={{ color: "#DD5123" }}>early testing</span>
                    </h3>

                    <form
                      onSubmit={handleEarlyAccess}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <div className="relative flex-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="3" />
                          <path d="m3.5 7 8.5 6 8.5-6" />
                        </svg>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full pl-11 pr-4 py-4 rounded-2xl text-white placeholder-white/25 text-sm focus:outline-none transition-all"
                          style={{
                            background: "#0D0D0D",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "rgba(221,81,35,0.6)";
                            e.target.style.boxShadow = "0 0 0 4px rgba(221,81,35,0.12)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "rgba(255,255,255,0.12)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
                        style={{
                          background: "linear-gradient(90deg, #DD5123, #B8421C)",
                          boxShadow: "0 10px 30px -10px rgba(221,81,35,0.7)",
                        }}
                      >
                        {status === "submitting" ? (
                          "Sending…"
                        ) : (
                          <>
                            Get Early Access
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>

                    {status === "error" && (
                      <p className="text-xs mt-3" style={{ color: "#FF6B6B" }}>
                        {message}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 mt-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white/45 border border-white/[0.08] bg-white/[0.04]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#DD5123" }} />
                        10,000+ players waiting
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/45 border border-white/[0.08] bg-white/[0.04]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3" style={{ color: "#DD5123" }}>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        No spam
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/45 border border-white/[0.08] bg-white/[0.04]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3" style={{ color: "#DD5123" }}>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Free forever
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right — App visual */}
          <div className="hidden lg:flex justify-end items-center">
            <div
              className="relative"
              style={{ width: "320px" }}
            >
              {/* Main logo block */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  width: "280px",
                  height: "280px",
                  border: "1px solid rgba(221,81,35,0.18)",
                  background: "#111111",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Sudokult app"
                  fill
                  sizes="280px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating badge: Live Players */}
              <div
                className="absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                style={{
                  bottom: "-20px",
                  right: "-30px",
                  background: "#151515",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minWidth: "170px",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 animate-live"
                  style={{ background: "#DD5123" }}
                />
                <div>
                  <div className="text-white font-bold text-sm font-mono">10,000+</div>
                  <div className="label text-white/35" style={{ fontSize: "0.55rem" }}>Players online now</div>
                </div>
              </div>

              {/* Floating badge: Rating */}
              <div
                className="absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl"
                style={{
                  top: "-20px",
                  left: "-30px",
                  background: "#151515",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span style={{ color: "#DD5123", fontSize: "1rem" }}>★</span>
                <div>
                  <div className="text-white font-bold text-sm font-mono">4.9</div>
                  <div className="label text-white/35" style={{ fontSize: "0.55rem" }}>Play Store</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
        <span className="label text-white/50" style={{ fontSize: "0.55rem" }}>Scroll</span>
        <div className="w-px h-10 bg-white/20" />
      </div>
    </section>
  );
}
