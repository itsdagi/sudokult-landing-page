"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Lightbulb, Pencil, Eraser, Award, Sparkles, Smartphone } from "lucide-react";
import confetti from "canvas-confetti";
import { audioEngine } from "./AudioEngine";

// Sample valid puzzles
const ACOLYTE_PUZZLE = {
  initial: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  solution: [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
};

const ADEPT_PUZZLE = {
  initial: [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
  solution: [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
  ],
};

const GRANDMASTER_PUZZLE = {
  initial: [
    [0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0, 3],
    [0, 7, 4, 0, 8, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 2],
    [0, 8, 0, 0, 4, 0, 0, 1, 0],
    [6, 0, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 7, 8, 0],
    [5, 0, 0, 0, 0, 9, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0],
  ],
  solution: [
    [1, 2, 6, 4, 3, 7, 9, 5, 8],
    [8, 9, 5, 6, 2, 1, 4, 7, 3],
    [3, 7, 4, 9, 8, 5, 1, 2, 6],
    [4, 5, 7, 1, 9, 3, 8, 6, 2],
    [9, 8, 3, 2, 4, 6, 5, 1, 7],
    [6, 1, 2, 5, 7, 8, 3, 9, 4],
    [2, 6, 9, 3, 1, 4, 7, 8, 5],
    [5, 4, 8, 7, 6, 9, 2, 3, 1],
    [7, 3, 1, 8, 5, 2, 6, 4, 9],
  ],
};

export default function SacredGridSection() {
  const [difficulty, setDifficulty] = useState<"acolyte" | "adept" | "grandmaster">("acolyte");
  const [gridData, setGridData] = useState<number[][]>(ACOLYTE_PUZZLE.initial);
  const [solution, setSolution] = useState<number[][]>(ACOLYTE_PUZZLE.solution);
  const [notes, setNotes] = useState<Set<number>[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>()))
  );

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 2]);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSolved, setIsSolved] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isSolved) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isSolved]);

  const loadDifficulty = (diff: "acolyte" | "adept" | "grandmaster") => {
    audioEngine.playClick(500);
    setDifficulty(diff);
    const p = diff === "acolyte" ? ACOLYTE_PUZZLE : diff === "adept" ? ADEPT_PUZZLE : GRANDMASTER_PUZZLE;
    setGridData(p.initial);
    setSolution(p.solution);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>())));
    setSelectedCell(null);
    setMistakes(0);
    setHintsUsed(0);
    setSeconds(0);
    setIsSolved(false);
    setIsPlaying(true);
  };

  const currentInitial = difficulty === "acolyte" ? ACOLYTE_PUZZLE.initial : difficulty === "adept" ? ADEPT_PUZZLE.initial : GRANDMASTER_PUZZLE.initial;

  const handleCellSelect = (r: number, c: number) => {
    audioEngine.playSelectCell();
    setSelectedCell([r, c]);
  };

  const handleInputNumber = (num: number) => {
    if (!selectedCell || isSolved) return;
    const [r, c] = selectedCell;
    if (currentInitial[r][c] !== 0) return;

    if (isPencilMode) {
      audioEngine.playClick(700, "sine", 0.05);
      const newNotes = notes.map((rowArr, ri) =>
        rowArr.map((setVal, ci) => {
          if (ri === r && ci === c) {
            const nextSet = new Set(setVal);
            if (nextSet.has(num)) {
              nextSet.delete(num);
            } else {
              nextSet.add(num);
            }
            return nextSet;
          }
          return setVal;
        })
      );
      setNotes(newNotes);
      return;
    }

    if (gridData[r][c] === num) return;

    if (num !== solution[r][c]) {
      audioEngine.playError();
      setMistakes((prev) => prev + 1);
    } else {
      audioEngine.playEnterNumber();
    }

    const nextGrid = gridData.map((rowArr, ri) =>
      rowArr.map((val, ci) => (ri === r && ci === c ? num : val))
    );
    setGridData(nextGrid);

    let solved = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (nextGrid[i][j] !== solution[i][j]) solved = false;
      }
    }
    if (solved) {
      setIsSolved(true);
      audioEngine.playVictory();
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF5722", "#8E24AA", "#FFD700"],
      });
    }
  };

  const handleErase = () => {
    if (!selectedCell || isSolved) return;
    const [r, c] = selectedCell;
    if (currentInitial[r][c] !== 0) return;
    audioEngine.playClick(350);

    const nextGrid = gridData.map((rowArr, ri) =>
      rowArr.map((val, ci) => (ri === r && ci === c ? 0 : val))
    );
    setGridData(nextGrid);

    const newNotes = notes.map((rowArr, ri) =>
      rowArr.map((setVal, ci) => (ri === r && ci === c ? new Set<number>() : setVal))
    );
    setNotes(newNotes);
  };

  const handleConsultOracle = () => {
    if (isSolved) return;
    audioEngine.playHint();
    setHintsUsed((prev) => prev + 1);

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (gridData[r][c] !== solution[r][c]) {
          const correctVal = solution[r][c];
          const nextGrid = gridData.map((rowArr, ri) =>
            rowArr.map((val, ci) => (ri === r && ci === c ? correctVal : val))
          );
          setGridData(nextGrid);
          setSelectedCell([r, c]);

          let win = true;
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if (nextGrid[i][j] !== solution[i][j]) win = false;
            }
          }
          if (win) {
            setIsSolved(true);
            audioEngine.playVictory();
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.6 },
            });
          }
          return;
        }
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedVal = selectedCell ? gridData[selectedCell[0]][selectedCell[1]] : null;

  return (
    <section id="sacred-grid" className="py-24 relative overflow-hidden bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRY THE ENGINE LIVE ON WEB</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            TEST THE <span className="text-primary-gradient">LOGIC ENGINE</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Experience our zero-latency puzzle player styled with exact mobile app design tokens. Select difficulty, toggle candidate notes, and seal the grid.
          </p>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-[#111111] border border-white/10 flex items-center gap-2">
            <button
              onClick={() => loadDifficulty("acolyte")}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                difficulty === "acolyte"
                  ? "bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Acolyte
            </button>
            <button
              onClick={() => loadDifficulty("adept")}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                difficulty === "adept"
                  ? "bg-[#8E24AA] text-white shadow-lg shadow-[#8E24AA]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Adept
            </button>
            <button
              onClick={() => loadDifficulty("grandmaster")}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                difficulty === "grandmaster"
                  ? "bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Grandmaster
            </button>
          </div>
        </div>

        {/* Board Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#111111] border border-[#FF5722]/30 p-4 sm:p-8 shadow-2xl glow-primary">
          
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-[#181818] border border-white/10 text-gray-300 hover:text-[#FF5722]"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="font-mono text-2xl font-bold text-white tracking-widest">
                {formatTime(seconds)}
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">MISTAKES:</span>
                <span className={`font-bold ${mistakes > 0 ? "text-[#FF3333]" : "text-[#00E676]"}`}>
                  {mistakes}/3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">HINTS:</span>
                <span className="text-[#FFD700] font-bold">{hintsUsed}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDifficulty(difficulty)}
                className="px-3 py-1.5 rounded-xl bg-[#181818] border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleConsultOracle}
                className="px-3 py-1.5 rounded-xl bg-[#FF5722]/20 border border-[#FF5722]/40 text-xs font-mono text-[#FF5722] font-bold flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hint</span>
              </button>
            </div>
          </div>

          {/* Victory Overlay */}
          {isSolved && (
            <div className="mb-6 p-4 rounded-2xl bg-[#00E676]/20 border border-[#00E676]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#FFD700] animate-bounce" />
                <div>
                  <div className="font-mono font-bold text-lg text-[#00E676]">
                    GRID SEALED IN {formatTime(seconds)}!
                  </div>
                  <div className="text-xs text-gray-300">
                    Get the Google Play app to solve daily rites with micro-haptic feedback!
                  </div>
                </div>
              </div>
              <button
                onClick={() => loadDifficulty(difficulty === "acolyte" ? "adept" : "grandmaster")}
                className="px-4 py-2 rounded-xl bg-[#FF5722] text-white font-bold text-xs font-mono"
              >
                Next Level →
              </button>
            </div>
          )}

          {/* 9x9 Board */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-9 gap-0.5 p-2 bg-[#080808] rounded-2xl border-2 border-[#FF5722]/40 shadow-inner w-full max-w-[480px] aspect-square">
              {gridData.map((row, r) =>
                row.map((val, c) => {
                  const isGiven = currentInitial[r][c] !== 0;
                  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                  const isSameValue = selectedVal !== null && selectedVal !== 0 && val === selectedVal;
                  const cellNotes = notes[r][c];

                  const borderRight = (c + 1) % 3 === 0 && c < 8 ? "border-r-2 border-r-[#FF5722]/50" : "";
                  const borderBottom = (r + 1) % 3 === 0 && r < 8 ? "border-b-2 border-b-[#FF5722]/50" : "";

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellSelect(r, c)}
                      className={`relative aspect-square flex items-center justify-center font-mono text-lg sm:text-2xl font-bold transition-all ${borderRight} ${borderBottom} ${
                        isSelected
                          ? "sudoku-cell-selected"
                          : isSameValue
                          ? "sudoku-cell-same-num"
                          : isGiven
                          ? "bg-white/[0.04] text-gray-200"
                          : val !== 0
                          ? "bg-[#FF5722]/15 text-[#FF5722]"
                          : "bg-white/[0.01] text-gray-600 hover:bg-white/[0.06]"
                      }`}
                    >
                      {val !== 0 ? (
                        val
                      ) : cellNotes.size > 0 ? (
                        <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 text-[9px] text-gray-400 leading-none">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <span key={n} className="flex items-center justify-center">
                              {cellNotes.has(n) ? n : ""}
                            </span>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Keypad & Pencil Mode */}
          <div className="flex flex-col gap-4 max-w-[480px] mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  audioEngine.playClick(600);
                  setIsPencilMode(!isPencilMode);
                }}
                className={`py-3 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isPencilMode
                    ? "bg-[#FF5722]/30 border-[#FF5722] text-[#FF5722]"
                    : "bg-[#181818] border-white/10 text-gray-400"
                }`}
              >
                <Pencil className="w-4 h-4" />
                <span>Pencil Notes {isPencilMode ? "(ON)" : "(OFF)"}</span>
              </button>

              <button
                onClick={handleErase}
                className="py-3 rounded-xl bg-[#181818] border border-white/10 text-gray-400 hover:text-[#FF3333] font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                <Eraser className="w-4 h-4" />
                <span>Erase Cell</span>
              </button>
            </div>

            <div className="grid grid-cols-9 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleInputNumber(num)}
                  className="py-3.5 rounded-xl bg-[#181818] border border-white/10 hover:border-[#FF5722]/50 hover:bg-[#FF5722]/20 hover:text-[#FF5722] text-white font-mono font-bold text-lg sm:text-xl transition-all active:scale-95"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
