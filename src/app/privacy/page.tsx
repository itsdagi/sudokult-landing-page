import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Sudokult",
  description:
    "How Sudokult collects, uses and protects your information across the multiplayer Sudoku experience.",
};

function Card({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
      <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white">
        <span className="text-2xl leading-none" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4 text-white/60 leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-white/60">
          <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#DD5123]" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-white/90 first:mt-0">
      {children}
    </h3>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#DD5123]/30 selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6" style={{ maxWidth: "840px" }}>
          {/* Header */}
          <header className="mb-14 pb-10 border-b border-white/[0.08]">
            <span
              className="label font-mono text-[#DD5123]"
              style={{ fontSize: "0.65rem", letterSpacing: "0.18em" }}
            >
              LEGAL // PRIVACY POLICY
            </span>

            <h1 className="mt-4 text-5xl sm:text-7xl font-extrabold tracking-tight leading-none">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-xl text-white/40 text-base sm:text-lg leading-relaxed">
              Your privacy matters. This policy explains how Sudokult collects, uses and protects
              your information.
            </p>

            <div
              className="mt-8 inline-block px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-mono text-white/40"
            >
              Last Updated • August 6, 2026
            </div>
          </header>

          {/* Content */}
          <div className="space-y-6">
            <Card icon="👋" title="Welcome">
              <p>
                Welcome to <span className="font-semibold text-[#DD5123]">Sudokult</span>, a
                multiplayer Sudoku experience that combines competitive gameplay, magical tricks,
                customizable skins, achievements, and interactive learning.
              </p>
              <p className="mt-4">
                This Privacy Policy explains how we collect, use, and protect your information
                whenever you use the Sudokult mobile application.
              </p>
            </Card>

            <Card icon="👤" title="Information We Collect">
              <SubHeading>Account Information</SubHeading>
              <List items={["Name or Username", "Email Address", "Profile Picture (optional)"]} />

              <SubHeading>Gameplay Data</SubHeading>
              <List
                items={[
                  "XP & achievements",
                  "Rankings & leaderboards",
                  "Match history",
                  "Academy progress",
                  "Puzzle progress",
                  "Unlocked skins",
                  "Game settings & preferences",
                ]}
              />

              <SubHeading>Technical Information</SubHeading>
              <List
                items={[
                  "Device model",
                  "Operating system",
                  "App version",
                  "Crash logs",
                  "Language & timezone",
                ]}
              />
            </Card>

            <Card icon="🎮" title="Multiplayer">
              <p>
                To provide online multiplayer, other players may see your username, avatar, rank,
                achievements, XP and online status.
              </p>
              <p className="mt-4">Your email address is never shared with other players.</p>
            </Card>

            <Card icon="💳" title="In-App Purchases">
              <p>
                Sudokult offers optional purchases including premium content, skins, subscriptions
                and cosmetic items.
              </p>
              <p className="mt-4">
                Payments are securely processed by <strong className="text-white/90">Google Play Billing</strong>{" "}
                or <strong className="text-white/90">Apple App Store</strong>.
              </p>
              <p className="mt-4">We never receive or store your payment card information.</p>
            </Card>

            <Card icon="🔒" title="How We Use Your Information">
              <List
                items={[
                  "Create and manage your account",
                  "Save your progress",
                  "Enable multiplayer matches",
                  "Display rankings",
                  "Provide purchased content",
                  "Improve gameplay",
                  "Prevent cheating and abuse",
                  "Provide customer support",
                  "Maintain security",
                ]}
              />
            </Card>

            <Card icon="🤝" title="Sharing Information">
              <p>
                We do <strong className="text-white/90">not sell</strong> your personal information.
              </p>
              <p className="mt-4">
                Information may be shared only with trusted service providers that help operate
                Sudokult, including authentication, cloud hosting, multiplayer infrastructure,
                payment processing, analytics, and security services.
              </p>
            </Card>

            <Card icon="🛡️" title="Data Security">
              <p>
                We use reasonable administrative, technical, and organizational safeguards to
                protect your information.
              </p>
              <p className="mt-4">
                Although we work hard to secure your data, no internet service can guarantee
                complete security.
              </p>
            </Card>

            <Card icon="🧒" title="Children's Privacy">
              <p>Sudokult is not intended for children under the age of 13.</p>
              <p className="mt-4">
                We do not knowingly collect personal information from children under 13.
              </p>
            </Card>

            <Card icon="🗑️" title="Account Deletion">
              <p>
                You may request deletion of your account and personal information at any time by
                contacting us.
              </p>
              <p className="mt-4">
                Once verified, we will delete your information unless we are legally required to
                retain certain records.
              </p>
            </Card>

            <section className="rounded-2xl border border-[#DD5123]/25 bg-[#DD5123]/[0.06] p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white">
                <span className="text-2xl leading-none" aria-hidden>
                  📧
                </span>
                Contact Us
              </h2>
              <p className="mt-4 text-white/60 leading-relaxed">
                If you have questions regarding this Privacy Policy or your personal information,
                contact us anytime.
              </p>
              <a
                href="mailto:dagimalemux@gmail.com"
                className="mt-5 inline-block font-semibold text-[#DD5123] hover:opacity-80 transition-opacity"
              >
                dagimalemux@gmail.com
              </a>
            </section>
          </div>

          {/* Tagline */}
          <p className="mt-16 text-center text-sm font-mono text-white/30">
            Think Fast • Solve Smarter • Outsmart Your Opponent
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
