"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConnectTelegram from "@/components/auth/ConnectTelegram";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/telegram/status", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await res.json();
      setConnected(!!body.connected);
      setLoading(false);
    }
    load();
  }, [router]);

  async function unlink() {
    setUnlinking(true);
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) return;

    await fetch("/api/telegram/unlink", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setConnected(false);
    setUnlinking(false);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-40 pb-24">
        <div className="container mx-auto px-6" style={{ maxWidth: "460px" }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-10">Your Account</h1>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6 sm:p-8">
            <p className="label text-white/40 mb-4">Telegram</p>

            {loading ? (
              <p className="text-white/40 text-sm">Loading…</p>
            ) : connected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <span>✓</span> Telegram connected
                </div>
                <button
                  onClick={unlink}
                  disabled={unlinking}
                  className="text-sm text-white/40 hover:text-red-400 underline disabled:opacity-50"
                >
                  {unlinking ? "Disconnecting…" : "Disconnect Telegram"}
                </button>
              </div>
            ) : (
              <ConnectTelegram mode="auth" onLinked={() => setConnected(true)} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
