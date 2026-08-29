import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { generateLinkToken } from "@/lib/telegramBot";
import { getClientIp } from "@/lib/requestContext";

const LINK_TOKEN_TTL_MS = 10 * 60 * 1000;
const MAX_PER_IP_PER_HOUR = 8;

/**
 * Creates a "Connect Telegram" deep-link token for a visitor who does not
 * have a Sudokult session yet (first-time sign-up via Telegram).
 */
export async function POST(request: Request) {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return Response.json({ error: "Telegram login is not configured yet." }, { status: 500 });
  }

  const ip = getClientIp(request);
  const supabase = getSupabaseAdmin();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("telegram_link_tokens")
    .select("id", { count: "exact", head: true })
    .is("user_id", null)
    .eq("request_ip", ip)
    .gte("created_at", oneHourAgo);

  if ((count ?? 0) >= MAX_PER_IP_PER_HOUR) {
    return Response.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const { token, hash } = generateLinkToken();
  const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MS).toISOString();

  const { error } = await supabase.from("telegram_link_tokens").insert({
    token_hash: hash,
    user_id: null,
    request_ip: ip,
    expires_at: expiresAt,
  });

  if (error) {
    return Response.json({ error: "Could not start Telegram linking. Please try again." }, { status: 500 });
  }

  return Response.json({
    token,
    deepLink: `https://t.me/${botUsername}?start=${token}`,
    expiresAt,
  });
}
