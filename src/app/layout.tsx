import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudokult — Multiplayer Magic Sudoku",
  description:
    "The world's first real-time multiplayer Sudoku game. Cast spells to distract opponents while racing to solve the grid. Free on Google Play.",
  keywords: [
    "sudoku",
    "multiplayer sudoku",
    "sudoku game android",
    "magic sudoku",
    "puzzle game",
    "sudokult",
  ],
  openGraph: {
    title: "Sudokult — Multiplayer Magic Sudoku",
    description:
      "Cast spells. Distract opponents. Solve the grid. The world's first real-time multiplayer Sudoku.",
    type: "website",
    url: "https://sudokult.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudokult — Multiplayer Magic Sudoku",
    description: "The world's first real-time multiplayer Sudoku. Free on Google Play.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
