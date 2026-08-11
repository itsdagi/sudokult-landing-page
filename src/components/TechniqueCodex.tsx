"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Zap, Target, Eye, Sparkles } from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface Technique {
  id: string;
  name: string;
  difficulty: "Intermediate" | "Advanced" | "Grandmaster";
  description: string;
  rule: string;
  diagram: {
    highlightRows: number[];
    highlightCols: number[];
    pivotCells: [number, number][];
    eliminatedCells: [number, number][];
    targetDigit: number;
  };
}

const TECHNIQUES: Technique[] = [
  {
    id: "x-wing",
    name: "The X-Wing Pattern",
    difficulty: "Intermediate",
    description:
      "When a candidate digit appears exactly twice in two parallel rows and occupies the exact same two columns, all other candidates of that digit in those columns can be eliminated.",
    rule: "2 Parallel Rows × 2 Matching Columns = Total Column Cleanse.",
    diagram: {
      highlightRows: [1, 7],
      highlightCols: [2, 6],
      pivotCells: [
        [1, 2],
        [1, 6],
        [7, 2],
        [7, 6],
      ],
      eliminatedCells: [
        [3, 2],
        [5, 2],
        [2, 6],
        [4, 6],
      ],
      targetDigit: 7,
    },
  },
  {
    id: "swordfish",
    name: "The Swordfish Matrix",
    difficulty: "Advanced",
    description:
      "An extension of the X-Wing to 3 rows and 3 columns. When a candidate is constrained to a maximum of 3 columns across 3 rows, candidates in those columns outside the grid intersections vanish.",
    rule: "3-Row Triangulation -> 3-Column Annihilation.",
    diagram: {
      highlightRows: [0, 4, 8],
      highlightCols: [1, 4, 7],
      pivotCells: [
        [0, 1],
        [0, 7],
        [4, 1],
        [4, 4],
        [8, 4],
        [8, 7],
      ],
      eliminatedCells: [
        [2, 1],
        [6, 4],
        [3, 7],
      ],
      targetDigit: 4,
    },
  },
  {
    id: "xy-wing",
    name: "The XY-Wing Pincer",
    difficulty: "Grandmaster",
    description:
      "A bivalue pivot cell {X,Y} connected to two wing cells {X,Z} and {Y,Z}. Any cell seeing both wings cannot contain digit Z, creating an unavoidable logic trap.",
    rule: "Pivot {X,Y} + Wings {X,Z},{Y,Z} -> Force Elim of Z.",
    diagram: {
      highlightRows: [2, 6],
      highlightCols: [3, 8],
      pivotCells: [
        [2, 3], // Pivot {4,9}
        [2, 8], // Wing 1 {4,7}
        [6, 3], // Wing 2 {9,7}
      ],
      eliminatedCells: [[6, 8]], // Sees both wings -> elim 7
      targetDigit: 7,
    },
  },
];

export default function TechniqueCodex() {
  const [activeTechId, setActiveTechId] = useState<string>("x-wing");
  const [activeStep, setActiveStep] = useState<number>(0);

  const activeTech = TECHNIQUES.find((t) => t.id === activeTechId) || TECHNIQUES[0];

  const handleSelectTech = (id: string) => {
    audioEngine.playClick(550);
    setActiveTechId(id);
    setActiveStep(0);
  };

  return (
    <section id="technique-codex" className="py-24 bg-[#09090e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>INTERACTIVE CODEX OF PATTERNS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            THE SACRED <span className="text-purple-gradient">LOGIC CODEX</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Sudokult puzzles never require guessing. Master the mathematical patterns used by world champions to dismantle any grid.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Technique Selector Menu */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {TECHNIQUES.map((tech) => {
              const isSelected = tech.id === activeTechId;
              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelectTech(tech.id)}
                  className={`p-6 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-glass-card border-2 border-purple-500/50 shadow-xl glow-purple scale-[1.02]"
                      : "bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        tech.difficulty === "Intermediate"
                          ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                          : tech.difficulty === "Advanced"
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                      }`}
                    >
                      {tech.difficulty}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-purple-400 translate-x-1" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Visual Codex Board Display */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-glass-card border border-white/10 shadow-2xl">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{activeTech.name}</h3>
                <p className="text-xs text-purple-400 font-mono font-semibold">
                  RULE: {activeTech.rule}
                </p>
              </div>

              {/* Interactive Step Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioEngine.playClick(400);
                    setActiveStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-colors ${
                    activeStep === 0
                      ? "bg-purple-500 text-white font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  1. Identify Intersections
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick(600);
                    setActiveStep(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-colors ${
                    activeStep === 1
                      ? "bg-purple-500 text-white font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  2. Candidate Elimination
                </button>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {activeStep === 0
                ? `Highlighting target digit candidates [${activeTech.diagram.targetDigit}] forming locked intersections.`
                : `Eliminating candidates outside locked geometry (marked red).`}
            </p>

            {/* Interactive Codex Grid Canvas */}
            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-9 gap-1 p-2 bg-[#070709] rounded-2xl border border-purple-500/30 w-full max-w-[420px] aspect-square">
                {Array(9)
                  .fill(null)
                  .map((_, r) =>
                    Array(9)
                      .fill(null)
                      .map((_, c) => {
                        const isPivot = activeTech.diagram.pivotCells.some(
                          ([pr, pc]) => pr === r && pc === c
                        );
                        const isEliminated = activeTech.diagram.eliminatedCells.some(
                          ([er, ec]) => er === r && ec === c
                        );
                        const isHighlightRow = activeTech.diagram.highlightRows.includes(r);

                        // 3x3 box borders
                        const borderRight = (c + 1) % 3 === 0 && c < 8 ? "border-r border-r-purple-500/40" : "";
                        const borderBottom = (r + 1) % 3 === 0 && r < 8 ? "border-b border-b-purple-500/40" : "";

                        return (
                          <div
                            key={`${r}-${c}`}
                            className={`aspect-square rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-all relative ${borderRight} ${borderBottom} ${
                              isPivot
                                ? "bg-purple-500/30 text-purple-300 border-2 border-purple-400 shadow-md glow-purple"
                                : isEliminated && activeStep === 1
                                ? "bg-red-500/25 text-red-400 border border-red-500/50"
                                : isHighlightRow
                                ? "bg-purple-500/10 text-gray-400"
                                : "bg-white/[0.02] text-gray-700"
                            }`}
                          >
                            {isPivot ? (
                              <span className="text-amber-300 text-base">{activeTech.diagram.targetDigit}</span>
                            ) : isEliminated && activeStep === 1 ? (
                              <span className="text-red-400 line-through font-extrabold">{activeTech.diagram.targetDigit}</span>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })
                  )}
              </div>
            </div>

            {/* Legend Footer */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-500/50 border border-purple-400 inline-block"></span>
                <span>Locked Intersection Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500/40 border border-red-500 inline-block"></span>
                <span>Eliminated Candidate</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
