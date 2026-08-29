import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/telegramBot";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? normalizePhone(body.phone) : null;
  const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

  if (!phone || !/^\d{6}$/.test(otp)) {
    return Response.json({ error: "Please enter the 6-digit code." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: attempts } = await supabase
    .from("telegram_verify_attempts")
    .select("failed_count, locked_until")
    .eq("phone_number", phone)
    .maybeSingle();

  if (attempts?.locked_until && new Date(attempts.locked_until).getTime() > Date.now()) {
    return Response.json(
      { error: "Too many incorrect attempts. Please request a new code later." },
      { status: 429 }
    );
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: "Login is not configured yet." }, { status: 500 });
  }

  const res = await fetch(`${url}/auth/v1/verify`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "sms", phone, token: otp }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.access_token) {
    const nextFailedCount = (attempts?.failed_count ?? 0) + 1;
    const lockedUntil =
      nextFailedCount >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS).toISOString() : null;

    await supabase.from("telegram_verify_attempts").upsert({
      phone_number: phone,
      failed_count: lockedUntil ? 0 : nextFailedCount,
      locked_until: lockedUntil,
      updated_at: new Date().toISOString(),
    });

    return Response.json({ error: "Incorrect or expired code. Please try again." }, { status: 400 });
  }

  await Promise.all([
    supabase.from("telegram_verify_attempts").delete().eq("phone_number", phone),
    supabase.from("telegram_accounts").update({ last_used_at: new Date().toISOString() }).eq("phone_number", phone),
  ]);

  return Response.json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type,
  });
}
