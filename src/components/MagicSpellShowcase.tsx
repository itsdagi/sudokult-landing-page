"use client";

import { useState } from "react";

const SPELLS = [
  {
    id: "earthquake",
    name: "Earthquake",
    kanji: "地震",
    desc: "Violently shakes the opponent's grid for 3 seconds, breaking their concentration.",
    cooldown: "15s",
    effect: "shake",
  },
  {
    id: "smoke",
    name: "Smoke Screen",
    kanji: "煙幕",
    desc: "Covers 5 random cells with thick fog. Opponent can't see numbers underneath.",
    cooldown: "20s",
    effect: "smoke",
  },
  {
    id: "scramble",
    name: "Mind Scramble",
    kanji: "混乱",
    desc: "Temporarily shuffles all pencil-mark candidates on opponent's board.",
    cooldown: "30s",
    effect: "scramble",
  },
];

// A tiny static 6×6 board for the demo
const BOARD = [
  [5, 3, 0, 0, 7, 0],
  [6, 0, 0, 1, 9, 5],
  [0, 9, 8, 0, 0, 0],
  [8, 0, 0, 0, 6, 0],
  [4, 0, 0, 8, 0, 3],
  [7, 0, 0, 0, 2, 6],
];

export default function MagicSpellShowcase() {
  const [activeSpell, setActiveSpell] = useState<string | null>(null);
  const [firing, setFiring] = useState(false);
  const [effect, setEffect] = useState<string | null>(null);
  const [smokedCells, setSmokedCells] = useState<Set<string>>(new Set());

  const fireSpell = (spell: (typeof SPELLS)[0]) => {
    if (firing) return;
    setActiveSpell(spell.id);
    setFiring(true);
    setEffect(null);
    setSmokedCells(new Set());

    setTimeout(() => {
      setEffect(spell.effect);

      if (spell.effect === "smoke") {
        // Pick 5 random cells
        const cells = new Set<string>();
        while (cells.size < 5) {
          cells.add(`${Math.floor(Math.random() * 6)}-${Math.floor(Math.random() * 6)}`);
        }
        setSmokedCells(cells);
      }

      setTimeout(() => {
        setEffect(null);
        setSmokedCells(new Set());
        setFiring(false);
      }, 2500);
    }, 200);
  };

  return (
    <section id="features" className="section border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="container mx-auto px-8" style={{ maxWidth: "1140px" }}>

        {/* Header */}
        <div className="mb-20">
          <p className="label text-white/30 mb-5">Magic System</p>
          <h2 className="heading-lg text-white" style={{ maxWidth: "520px" }}>
            Cast spells.<br />
            <span style={{ color: "#DD5123" }}>Win minds.</span>
          </h2>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Spell list */}
          <div className="flex flex-col gap-0">
            {SPELLS.map((spell, i) => (
              <div key={spell.id}>
                <button
                  onClick={() => fireSpell(spell)}
                  className="w-full text-left py-8 group transition-all duration-200"
                  style={{
                    opacity: activeSpell && activeSpell !== spell.id ? 0.4 : 1,
                  }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5">
                      {/* Number */}
                      <span
                        className="label shrink-0 mt-0.5"
                        style={{ color: "#DD5123", fontSize: "0.6rem" }}
                      >
                        0{i + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-lg tracking-tight">
                            {spell.name}
                          </h3>
                          <span
                            className="text-sm font-light opacity-20"
                            style={{ fontFamily: "serif" }}
                          >
                            {spell.kanji}
                          </span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed" style={{ maxWidth: "360px" }}>
                          {spell.desc}
                        </p>
                        <p className="label text-white/20 mt-3" style={{ fontSize: "0.6rem" }}>
                          Cooldown · {spell.cooldown}
                        </p>
                      </div>
                    </div>

                    {/* Test button */}
                    <span
                      className="label shrink-0 mt-1 px-3 py-1.5 rounded-full text-white/60 transition-all duration-200 group-hover:text-white border"
                      style={{
                        fontSize: "0.6rem",
                        borderColor: activeSpell === spell.id && firing
                          ? "#DD5123"
                          : "rgba(255,255,255,0.08)",
                        color: activeSpell === spell.id && firing ? "#DD5123" : undefined,
                      }}
                    >
                      {activeSpell === spell.id && firing ? "Casting…" : "Try it →"}
                    </span>
                  </div>
                </button>
                {i < SPELLS.length - 1 && (
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Right — Board preview */}
          <div className="lg:sticky lg:top-24">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="label text-white/30" style={{ fontSize: "0.6rem" }}>
                  Opponent board · Alex_Vance
                </span>
                <span
                  className="flex items-center gap-1.5 label"
                  style={{ color: "#DD5123", fontSize: "0.6rem" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-live" style={{ background: "#DD5123" }} />
                  Live
                </span>
              </div>

              {/* Mini 6×6 sudoku grid */}
              <div
                className={`grid gap-0.5 ${effect === "shake" ? "animate-shake" : ""}`}
                style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
              >
                {BOARD.map((row, ri) =>
                  row.map((cell, ci) => {
                    const key = `${ri}-${ci}`;
                    const isSmoked = smokedCells.has(key);
                    const isScrambled = effect === "scramble" && cell === 0;
                    const border3col = ci === 2 ? "border-r-2" : "";
                    const border3row = ri === 2 ? "border-b-2" : "";

                    return (
                      <div
                        key={key}
                        className={`relative flex items-center justify-center ${border3col} ${border3row}`}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          background: isSmoked
                            ? "rgba(221,81,35,0.2)"
                            : cell
                            ? "#1A1A1A"
                            : "#141414",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRightColor: ci === 2 ? "rgba(255,255,255,0.15)" : undefined,
                          borderBottomColor: ri === 2 ? "rgba(255,255,255,0.15)" : undefined,
                          fontSize: "1.1rem",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: cell ? "rgba(255,255,255,0.8)" : "transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        {isSmoked ? (
                          <span className="animate-smoke text-lg">🌫</span>
                        ) : isScrambled ? (
                          <span style={{ fontSize: "0.6rem", color: "rgba(221,81,35,0.6)" }}>??</span>
                        ) : (
                          cell || ""
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Effect label */}
              <div className="mt-4 h-6 flex items-center">
                {effect === "shake" && (
                  <p className="label text-white/40" style={{ fontSize: "0.6rem" }}>
                    ⚡ Earthquake — opponent board shaking
                  </p>
                )}
                {effect === "smoke" && (
                  <p className="label text-white/40" style={{ fontSize: "0.6rem" }}>
                    🌫 Smoke Screen — 5 cells obscured
                  </p>
                )}
                {effect === "scramble" && (
                  <p className="label text-white/40" style={{ fontSize: "0.6rem" }}>
                    🌀 Mind Scramble — candidates scrambled
                  </p>
                )}
                {!effect && (
                  <p className="label text-white/20" style={{ fontSize: "0.6rem" }}>
                    Click a spell to test distraction effect
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
