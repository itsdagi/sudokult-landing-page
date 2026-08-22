import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delete Your Account — Sudokult",
  description:
    "Request the permanent deletion of your Sudokult account and associated data.",
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

export default function DeleteAccountPage() {
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
              LEGAL // ACCOUNT DELETION
            </span>

            <h1 className="mt-4 text-5xl sm:text-7xl font-extrabold tracking-tight leading-none">
              Delete Your <span style={{ color: "#DD5123" }}>Sudokult</span> Account
            </h1>

            <p className="mt-6 max-w-xl text-white/40 text-base sm:text-lg leading-relaxed">
              Request the permanent deletion of your Sudokult account and associated data.
            </p>
          </header>

          {/* Content */}
          <div className="space-y-6">
            <Card icon="🧩" title="How to request account deletion">
              <p>
                If you would like to permanently delete your Sudokult account, please send an
                email to:
              </p>
              <a
                href="mailto:dagimalemux@gmail.com"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[#0A0A0A] transition-all hover:opacity-90"
                style={{ background: "#DD5123" }}
              >
                dagimalemux@gmail.com
              </a>
              <p className="mt-5">
                Include the email address associated with your Sudokult account so we can verify
                your request.
              </p>
            </Card>

            <Card icon="🗑️" title="What will be deleted">
              <List
                items={[
                  "Your account information",
                  "Your name and email address",
                  "Your profile information",
                  "Your multiplayer profile",
                  "Your game progress",
                  "Your XP and achievements",
                  "Your rankings and leaderboard records",
                  "Your Academy progress",
                  "Your saved preferences",
                ]}
              />
            </Card>

            <Card icon="🛡️" title="What may be retained">
              <p>We may retain limited information when required to:</p>
              <List
                items={[
                  "Comply with legal obligations.",
                  "Resolve disputes.",
                  "Prevent fraud or abuse.",
                  "Enforce our Terms of Service.",
                ]}
              />
              <p className="mt-5">
                Any retained information is kept only for as long as required by applicable law or
                legitimate business purposes.
              </p>
            </Card>

            <Card icon="⏱️" title="Deletion timeframe">
              <p>
                After verifying your request, we aim to delete your account and associated
                personal data within <strong className="text-white/90">30 days</strong>.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
