import Image from "next/image";

export default function Hero() {
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
