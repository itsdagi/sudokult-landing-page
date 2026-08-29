"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Status = "idle" | "starting" | "pending" | "awaiting_contact" | "linked" | "expired" | "error";

export default function ConnectTelegram({
  mode,
  onLinked,
}: {
  mode: "auth" | "anon";
  onLinked?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function start() {
    setStatus("starting");
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      let url = "/api/telegram/link-token/anon";

      if (mode === "auth") {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token;
        if (!accessToken) {
          setStatus("error");
          setError("Please sign in first.");
          return;
        }
        headers.Authorization = `Bearer ${accessToken}`;
        url = "/api/telegram/link-token";
      }

      const res = await fetch(url, { method: "POST", headers });
      const body = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(body.error ?? "Could not start Telegram linking.");
        return;
      }

      tokenRef.current = body.token;
      setDeepLink(body.deepLink);
      setStatus("pending");
      window.open(body.deepLink, "_blank", "noopener,noreferrer");
      pollRef.current = setInterval(poll, 2500);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  async function poll() {
    if (!tokenRef.current) return;
    try {
      const res = await fetch(`/api/telegram/link-status?token=${encodeURIComponent(tokenRef.current)}`);
      const body = await res.json();

      if (body.status === "linked") {
        if (pollRef.current) clearInterval(pollRef.current);
        setStatus("linked");
        onLinked?.();
      } else if (body.status === "expired" || body.status === "invalid") {
        if (pollRef.current) clearInterval(pollRef.current);
        setStatus("expired");
      } else {
        setStatus(body.status);
      }
    } catch {
      // transient network error while polling — keep trying silently
    }
  }

  if (status === "linked") {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <span>✓</span> Telegram connected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {status === "idle" || status === "error" ? (
        <button
          onClick={start}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white border border-white/[0.12] hover:border-white/25 transition-colors"
        >
          Connect Telegram
        </button>
      ) : null}

      {status === "starting" && <p className="text-sm text-white/40">Opening Telegram…</p>}

      {(status === "pending" || status === "awaiting_contact") && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-white/60 space-y-2">
          <p>
            {status === "pending"
              ? "Waiting for you to open Telegram and press Start…"
              : "Waiting for you to share your phone number in Telegram…"}
          </p>
          {deepLink && (
            <a href={deepLink} target="_blank" rel="noopener noreferrer" className="brand underline">
              Reopen Telegram
            </a>
          )}
        </div>
      )}

      {status === "expired" && (
        <div className="text-sm text-red-400">
          This link expired.{" "}
          <button onClick={start} className="underline">
            Try again
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
