import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashToken } from "@/lib/telegramBot";

/**
 * Polled by the frontend while the user is over in Telegram completing the
 * link. Returns only a coarse status enum — never the phone number, user id,
 * or Telegram identity — since this endpoint is intentionally unauthenticated
 * (the caller may not have a session yet).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return Response.json({ error: "Missing token." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("telegram_link_tokens")
    .select("used_at, expires_at, telegram_chat_id")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!data) return Response.json({ status: "invalid" });
  if (data.used_at) return Response.json({ status: "linked" });
  if (new Date(data.expires_at).getTime() < Date.now()) return Response.json({ status: "expired" });
  if (data.telegram_chat_id) return Response.json({ status: "awaiting_contact" });
  return Response.json({ status: "pending" });
}
