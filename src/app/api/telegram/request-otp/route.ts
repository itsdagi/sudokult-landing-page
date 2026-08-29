import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/telegramBot";
import { getClientIp } from "@/lib/requestContext";

const MAX_PER_PHONE_PER_HOUR = 5;
const MAX_PER_IP_PER_HOUR = 15;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? normalizePhone(body.phone) : null;

  if (!phone) {
    return Response.json({ error: "Please enter a valid phone number, e.g. +251911234567." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const ip = getClientIp(request);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const [{ count: phoneCount }, { count: ipCount }] = await Promise.all([
    supabase
      .from("telegram_otp_requests")
      .select("id", { count: "exact", head: true })
      .eq("phone_number", phone)
      .gte("created_at", oneHourAgo),
    supabase
      .from("telegram_otp_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", oneHourAgo),
  ]);

  if ((phoneCount ?? 0) >= MAX_PER_PHONE_PER_HOUR || (ipCount ?? 0) >= MAX_PER_IP_PER_HOUR) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  await supabase.from("telegram_otp_requests").insert({ phone_number: phone, ip });

  const { data: linked } = await supabase
    .from("telegram_accounts")
    .select("id")
    .eq("phone_number", phone)
    .maybeSingle();

  if (!linked) {
    return Response.json(
      {
        error:
          "This phone number isn't connected to Telegram yet. Tap \"Connect Telegram\" below to link it first.",
        code: "not_linked",
      },
      { status: 404 }
    );
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: "Login is not configured yet." }, { status: 500 });
  }

  const res = await fetch(`${url}/auth/v1/otp`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ phone, create_user: true }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.error("GoTrue /otp request failed:", res.status, data?.msg ?? data?.error_description);
    return Response.json(
      { error: "Could not send a code right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return Response.json({ success: true });
}
