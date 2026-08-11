"use client";

const MODES = [
  {
    id: "academy",
    label: "Academy",
    kanji: "学習",
    tagline: "Learn the game.",
    desc: "Structured lessons from beginner logic to advanced solving techniques. Learn when to cast spells and when to focus.",
    steps: [
      "Naked Singles & Hidden Singles",
      "Pointing Pairs & Box-Line Reduction",
      "X-Wing & Swordfish techniques",
      "Spell timing & opponent psychology",
    ],
  },
  {
    id: "solo",
    label: "Solo Practice",
    kanji: "修練",
    tagline: "Sharpen your mind.",
    desc: "Play any puzzle offline at your own pace. No opponents, no distractions. Just you and the grid.",
    steps: [
      "Difficulty from Beginner to Extreme",
      "Pencil notes & candidate tracking",
      "Hint system with explanation",
      "Solve history & speed records",
    ],
  },
];

export default function AcademyAndSolo() {
  return (
    <section
      id="academy"
      className="section border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="container mx-auto px-8" style={{ maxWidth: "1140px" }}>

        {/* Header */}
        <div className="mb-20">
          <p className="label text-white/30 mb-5">Game Modes</p>
          <h2 className="heading-lg text-white" style={{ maxWidth: "460px" }}>
            Train alone.<br />
            <span style={{ color: "#DD5123" }}>Dominate together.</span>
          </h2>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {MODES.map((mode, i) => (
            <div
              key={mode.id}
              className="py-12"
              style={{
                paddingRight: i === 0 ? "4rem" : "0",
                paddingLeft: i === 1 ? "4rem" : "0",
                borderRight: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {/* Mode label */}
              <div className="flex items-center gap-3 mb-8">
                <span className="label" style={{ color: "#DD5123", fontSize: "0.6rem" }}>
                  0{i + 1}
                </span>
                <span className="label text-white/25" style={{ fontSize: "0.6rem" }}>
                  {mode.label}
                </span>
                <span
                  className="text-lg opacity-15"
                  style={{ fontFamily: "serif", marginLeft: "auto" }}
                >
                  {mode.kanji}
                </span>
              </div>

              {/* Tagline */}
              <h3 className="heading-md text-white mb-4">{mode.tagline}</h3>

              {/* Description */}
              <p className="text-white/40 text-sm leading-relaxed mb-10" style={{ maxWidth: "380px" }}>
                {mode.desc}
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-3">
                {mode.steps.map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      className="w-4 h-px mt-[10px] shrink-0"
                      style={{ background: "#DD5123" }}
                    />
                    <span className="text-white/55 text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Matchmaking strip */}
        <div
          className="mt-20 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <p className="label text-white/30 mb-3" style={{ fontSize: "0.6rem" }}>
              Multiplayer Matchmaking
            </p>
            <h3 className="text-white font-bold text-xl mb-1">
              Challenge a friend by name.
            </h3>
            <p className="text-white/40 text-sm">
              Search their username in the database, or share a 6-digit room code.
            </p>
          </div>
          <div
            className="flex items-center gap-3 px-6 py-3.5 rounded-full text-white font-semibold text-sm shrink-0 transition-all hover:opacity-90"
            style={{ background: "#DD5123" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M3.18 23.76c.37.21.8.22 1.18.04l13.27-7.65-2.83-2.83-11.62 10.44zm-1.53-20.7A1.5 1.5 0 0 0 1.5 4.5v15a1.5 1.5 0 0 0 .15.66l11.76-10.58L1.65 3.06zM20.32 10.5l-2.9-1.67-3.2 2.88 3.2 2.88 2.92-1.68a1.5 1.5 0 0 0 0-2.41zM4.36.2C3.98.02 3.55.03 3.18.24L14.8 10.68l2.83-2.83L4.36.2z" />
            </svg>
            Get the App
          </div>
        </div>

      </div>
    </section>
  );
}
