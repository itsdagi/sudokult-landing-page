"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ConnectTelegram from "./ConnectTelegram";

type Step = "phone" | "otp";

export default function PhoneOtpLogin() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [notLinked, setNotLinked] = useState(false);

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setNotLinked(false);
    try {
      const res = await fetch("/api/telegram/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Could not send code.");
        if (body.code === "not_linked") setNotLinked(true);
        return;
      }
      setStep("otp");
      setNotice("We sent a verification code to your Telegram.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/telegram/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Incorrect or expired code.");
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      });
      if (sessionError) {
        setError("Could not complete sign-in. Please try again.");
        return;
      }

      router.push("/account");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={verifyOtp} className="space-y-4">
        {notice && <p className="text-sm text-white/50">{notice}</p>}
        <div>
          <label className="label text-white/40 block mb-2">Enter code</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            className="w-full text-center tracking-[0.5em] text-2xl font-mono px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder:text-white/20 focus:outline-none focus:border-[#DD5123]"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full px-5 py-3 rounded-xl font-bold text-[#0A0A0A] disabled:opacity-50 transition-opacity"
          style={{ background: "#DD5123" }}
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={() => sendOtp()} className="text-white/40 hover:text-white/70 underline">
            Resend code
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError(null);
            }}
            className="text-white/40 hover:text-white/70 underline"
          >
            Change phone number
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={sendOtp} className="space-y-4">
        <div>
          <label className="label text-white/40 block mb-2">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251911234567"
            type="tel"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder:text-white/20 focus:outline-none focus:border-[#DD5123]"
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !phone}
          className="w-full px-5 py-3 rounded-xl font-bold text-[#0A0A0A] disabled:opacity-50 transition-opacity"
          style={{ background: "#DD5123" }}
        >
          {loading ? "Sending…" : "Send OTP via Telegram"}
        </button>
      </form>

      {notLinked && (
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <p className="text-sm text-white/40">Link your Telegram account first, then come back and send the code.</p>
          <ConnectTelegram mode="anon" onLinked={() => setNotLinked(false)} />
        </div>
      )}
    </div>
  );
}
