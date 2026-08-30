import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAuthHookSignature } from "@/lib/authHookVerify";
import { sendTelegramOtp } from "@/lib/telegramBot";

/**
 * Supabase Auth "Send SMS Hook" target. Supabase calls this whenever it
 * generates a phone OTP; this endpoint is fully responsible for delivering
 * it (there is no fallback SMS provider). The OTP value is never logged —
 * only ever read out of `body.sms.otp` and handed to the Telegram API.
 */
export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_AUTH_HOOK_SECRET;
  if (!secret) {
    return Response.json({ error: { message: "Hook not configured." } }, { status: 500 });
  }

  const rawBody = await request.text();
  const isValid = verifyAuthHookSignature({ rawBody, headers: request.headers, secret });
  if (!isValid) {
    return Response.json({ error: { message: "Invalid signature." } }, { status: 401 });
  }

  let payload: { user?: { phone?: string }; sms?: { otp?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: { message: "Invalid payload." } }, { status: 400 });
  }

  const phone = payload.user?.phone;
  const otp = payload.sms?.otp;
  if (!phone || !otp) {
    return Response.json({ error: { message: "Missing phone or otp." } }, { status: 400 });
  }

  const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  const supabase = getSupabaseAdmin();
  const { data: linked } = await supabase
    .from("telegram_accounts")
    .select("telegram_chat_id")
    .eq("phone_number", normalizedPhone)
    .maybeSingle();

  if (!linked) {
    return Response.json({ error: { message: "Telegram account not linked." } }, { status: 400 });
  }

  try {
    await sendTelegramOtp(linked.telegram_chat_id, otp);
  } catch (err) {
    console.error(
      "Failed to deliver OTP via Telegram:",
      err instanceof Error ? err.message : err
    );
    return Response.json({ error: { message: "Could not deliver code via Telegram." } }, { status: 400 });
  }

  return Response.json({});
}
