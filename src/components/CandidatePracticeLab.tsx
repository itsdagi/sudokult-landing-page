"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, RefreshCw, Zap, Star } from "lucide-react";
import PlayStoreBadge from "./PlayStoreBadge";
import { audioEngine } from "./AudioEngine";

interface GridCell {
  row: number;
  col: number;
  value?: number;
  candidates: number[];
  isTarget?: boolean;
}

const INITIAL_GRID: GridCell[] = [
  { row: 1, col: 1, value: 5, candidates: [] },
  { row: 1, col: 2, candidates: [1, 7], isTarget: false },
  { row: 1, col: 3, candidates: [3, 9] },
  { row: 2, col: 1, candidates: [2, 4] },
  { row: 2, col: 2, candidates: [1, 7], isTarget: true }, // The target cell to eliminate candidate 7!
  { row: 2, col: 3, value: 8, candidates: [] },
  { row: 3, col: 1, candidates: [6, 9] },
  { row: 3, col: 2, value: 3, candidates: [] },
  { row: 3, col: 3, candidates: [1, 2] },
];

export default function CandidatePracticeLab() {
  const [grid, setGrid] = useState<GridCell[]>(INITIAL_GRID);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState("Click on the highlighted candidates in Cell (2,2) to eliminate them!");

  const handleCellClick = (cellIndex: number) => {
    const cell = grid[cellIndex];
    if (cell.isTarget && !solved) {
      audioEngine.playVictory();
      setSolved(true);
      setMessage("✨ Excellent Elimination! Candidate 7 removed from Cell (2,2). Naked Pair locked!");
    } else if (!cell.isTarget && !solved) {
      audioEngine.playError();
      setMessage("Try Cell (2,2) where candidates 1 and 7 form the target pair!");
    }
  };

  const handleReset = () => {
    setSolved(false);
    setGrid(INITIAL_GRID);
    setMessage("Click on the highlighted candidates in Cell (2,2) to eliminate them!");
    audioEngine.playSelectCell();
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#111111] border border-white/[0.08] mb-16 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-[#DD5123] font-mono text-xs font-bold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE SKILL TESTER</span>
          </div>
          <h3 className="text-xl font-bold text-white">Practice Strategy Live</h3>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-white/70 self-start sm:self-auto shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>4.9 ★ Rating</span>
          <span className="text-white/20">•</span>
          <span className="text-emerald-400 font-bold">10K+ Active Solvers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left: Interactive 3x3 Mini Sudoku Grid */}
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#0A0A0A] border border-white/10 rounded-xl max-w-[240px] w-full shadow-inner">
            {grid.map((cell, idx) => (
              <div
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`aspect-square rounded-lg flex items-center justify-center p-1 cursor-pointer transition-all duration-200 ${
                  cell.isTarget
                    ? solved
                      ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 scale-105"
                      : "bg-[#DD5123]/20 border-2 border-[#DD5123] text-[#DD5123] animate-pulse"
                    : "bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 text-white/60"
                }`}
              >
                {cell.value ? (
                  <span className="text-lg font-bold text-white font-mono">{cell.value}</span>
                ) : (
                  <div className="grid grid-cols-2 gap-1 text-[9px] font-mono leading-none">
                    {cell.candidates.map((c) => (
                      <span
                        key={c}
                        className={cell.isTarget && solved && c === 7 ? "line-through text-red-400 opacity-50" : ""}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feedback Message */}
          <div className="mt-4 text-center w-full">
            <p className={`text-xs font-mono transition-colors ${solved ? "text-emerald-400 font-bold" : "text-white/50"}`}>
              {message}
            </p>
            {solved && (
              <button
                onClick={handleReset}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono text-white/30 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Practice Grid</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Feature Info & Non-Clipping Download Action */}
        <div className="flex flex-col justify-between w-full min-w-0">
          <div className="mb-6">
            <span className="label text-white/40 block mb-2" style={{ fontSize: "0.6rem" }}>
              MOBILE APP EXPERIENCE
            </span>
            <h4 className="text-base font-bold text-white mb-2">
              Ready for Expert 81-Cell Grids?
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Sudokult features zero-latency gesture pencil notes, real-time candidate filtering, and synchronized daily 00:00 UTC rites.
            </p>
          </div>

          <PlayStoreBadge variant="banner" />
        </div>

      </div>

    </div>
  );
}
