import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { generateLinkToken } from "@/lib/telegramBot";
import { getAuthenticatedUserId } from "@/lib/requestContext";

const LINK_TOKEN_TTL_MS = 10 * 60 * 1000;

/** Creates a "Connect Telegram" deep-link token for an already-logged-in user. */
export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in first." }, { status: 401 });
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return Response.json({ error: "Telegram login is not configured yet." }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("telegram_accounts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return Response.json({ error: "Your account is already connected to Telegram." }, { status: 409 });
  }

  const { token, hash } = generateLinkToken();
  const expiresAt = new Date(Date.now() + LINK_TOKEN_TTL_MS).toISOString();

  const { error } = await supabase.from("telegram_link_tokens").insert({
    token_hash: hash,
    user_id: userId,
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
