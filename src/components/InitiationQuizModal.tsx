"use client";

import { useState } from "react";
import { X, Shield, Sparkles, CheckCircle2, Award, Copy, Check, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { audioEngine } from "./AudioEngine";

interface InitiationQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUIZ_QUESTIONS = [
  {
    question: "If cell (3,4) contains candidate digits 2 and 8, and row 3 already contains 2, what is the value of cell (3,4)?",
    options: ["2", "8", "Cannot be determined", "Both 2 and 8"],
    correctIndex: 1,
    explanation: "By Sudoku row uniqueness, digit 2 is eliminated, leaving digit 8.",
  },
  {
    question: "What is the maximum number of times digit 9 can appear in a solved 9x9 Sudoku grid?",
    options: ["81", "9", "27", "18"],
    correctIndex: 1,
    explanation: "Each of the 9 rows contains digit 9 exactly once, totaling 9.",
  },
  {
    question: "In an X-Wing pattern formed by candidate digit 4 in rows 2 and 7, where are candidate 4s eliminated?",
    options: ["In all other rows", "In the intersecting columns outside rows 2 & 7", "In the 3x3 diagonal boxes", "In rows 2 & 7"],
    correctIndex: 1,
    explanation: "An X-Wing locks the candidates to columns, eliminating them from those columns elsewhere.",
  },
];

export default function InitiationQuizModal({ isOpen, onClose }: InitiationQuizModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [initiateName, setInitiateName] = useState("");
  const [initiateEmail, setInitiateEmail] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [initiatedHash, setInitiatedHash] = useState("");

  if (!isOpen) return null;

  const handleSelectOption = (idx: number) => {
    audioEngine.playClick(480);
    setSelectedOption(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    audioEngine.playClick(650);
    const isCorrect = selectedOption === QUIZ_QUESTIONS[currentStep].correctIndex;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      // Quiz complete!
      setIsCompleted(true);
      const randomHash = `SDK-${Math.floor(1000 + Math.random() * 9000)}-${
        nextScore === 3 ? "GRANDMASTER" : "ADEPT"
      }`;
      setInitiatedHash(randomHash);
      audioEngine.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
  };

  const handleCopyPass = () => {
    audioEngine.playClick(700);
    navigator.clipboard.writeText(`I am initiated into SUDOKULT! Pass ID: ${initiatedHash}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f0f16] border border-amber-500/30 p-6 sm:p-8 shadow-2xl glow-gold">
        
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playClick(300);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                Initiation Trial • Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>

            {/* Options list */}
            <div className="flex flex-col gap-3 mb-8">
              {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl text-left font-medium text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-400/20 border-2 border-amber-400 text-amber-300"
                        : "bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Submit Question */}
            <button
              disabled={selectedOption === null}
              onClick={handleNextQuestion}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedOption !== null
                  ? "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/20 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? "Submit Trial" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Completion Initiate Pass Card */
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">INITIATION COMPLETE!</h3>
            <p className="text-sm text-gray-300 mb-6">
              You scored <span className="text-amber-400 font-bold font-mono">{score}/3</span> on the sacred logic test. Your initiation pass has been issued.
            </p>

            {/* Pass Badge */}
            <div className="p-6 rounded-2xl bg-[#070709] border border-amber-500/40 text-left mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
                  SUDOKULT OFFICIAL PASS
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px]">
                  VERIFIED
                </span>
              </div>

              <div className="font-mono text-xl font-bold text-white mb-1">
                {initiatedHash}
              </div>
              <div className="text-xs text-gray-400 font-mono">
                RANK: {score === 3 ? "GRANDMASTER ACOLYTE" : "LOGIC SOLVER"}
              </div>
            </div>

            {/* Form to enter waitlist */}
            <div className="flex flex-col gap-3 mb-6">
              <input
                type="text"
                placeholder="Enter your Alias / Handle"
                value={initiateName}
                onChange={(e) => setInitiateName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400"
              />
              <input
                type="email"
                placeholder="Enter Email to Claim Access"
                value={initiateEmail}
                onChange={(e) => setInitiateEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyPass}
                className="py-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? "Copied!" : "Copy Pass"}</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playVictory();
                  alert(`Welcome to Sudokult, ${initiateName || "Initiate"}! Early access link sent to ${initiateEmail || "your email"}.`);
                  onClose();
                }}
                className="py-3 rounded-xl bg-amber-400 text-black font-bold text-xs font-mono hover:bg-amber-300 shadow-lg shadow-amber-400/20"
              >
                Claim Sanctum Badge
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
