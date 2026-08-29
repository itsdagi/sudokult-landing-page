import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneOtpLogin from "@/components/auth/PhoneOtpLogin";

export const metadata: Metadata = {
  title: "Sign In — Sudokult",
  description: "Sign in to Sudokult using your Telegram-connected phone number.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#DD5123]/30 selection:text-white">
      <Navbar />

      <main className="pt-40 pb-24">
        <div className="container mx-auto px-6" style={{ maxWidth: "460px" }}>
          <header className="mb-10 text-center">
            <span className="label brand" style={{ fontSize: "0.65rem", letterSpacing: "0.18em" }}>
              WELCOME BACK
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
              Sign in to <span className="brand">Sudokult</span>
            </h1>
          </header>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <p className="label text-white/40 mb-4">Continue with Telegram</p>
            <PhoneOtpLogin />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
