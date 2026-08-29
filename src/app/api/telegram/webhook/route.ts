import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashToken, normalizePhone, requestTelegramContact, sendTelegramMessage } from "@/lib/telegramBot";

interface TelegramContact {
  phone_number: string;
  user_id?: number;
}

interface TelegramMessage {
  chat: { id: number };
  from: { id: number };
  text?: string;
  contact?: TelegramContact;
}

interface TelegramUpdate {
  message?: TelegramMessage;
}

const LINKED_MESSAGE = "✅ Your Telegram account has been successfully connected to Sudokult.";

export async function POST(request: Request) {
  const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret || secretHeader !== expectedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
  const message = update?.message;
  if (!message) return new Response("ok");

  try {
    if (message.contact) {
      await handleContact(message);
    } else if (message.text?.startsWith("/start")) {
      await handleStart(message);
    } else {
      await sendTelegramMessage(
        message.chat.id,
        "Send /start from a Sudokult \"Connect Telegram\" link to link your account."
      );
    }
  } catch (err) {
    console.error("Telegram webhook handling error:", err);
  }

  return new Response("ok");
}

async function handleStart(message: TelegramMessage) {
  const parts = message.text?.trim().split(/\s+/) ?? [];
  const rawToken = parts[1];
  if (!rawToken) {
    await sendTelegramMessage(
      message.chat.id,
      "Welcome! Open Sudokult and tap \"Connect Telegram\" to link your account."
    );
    return;
  }

  const supabase = getSupabaseAdmin();
  const tokenHash = hashToken(rawToken);

  const { data: linkToken } = await supabase
    .from("telegram_link_tokens")
    .select("id, user_id, used_at, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!linkToken || linkToken.used_at || new Date(linkToken.expires_at).getTime() < Date.now()) {
    await sendTelegramMessage(
      message.chat.id,
      "This link is invalid or has expired. Please return to Sudokult and try again."
    );
    return;
  }

  const { data: conflictingTelegram } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_user_id", message.from.id)
    .maybeSingle();

  if (conflictingTelegram && conflictingTelegram.user_id !== linkToken.user_id) {
    await sendTelegramMessage(
      message.chat.id,
      "This Telegram account is already connected to a different Sudokult account."
    );
    return;
  }

  await supabase
    .from("telegram_link_tokens")
    .update({ telegram_chat_id: message.chat.id, telegram_user_id: message.from.id })
    .eq("id", linkToken.id);

  await requestTelegramContact(
    message.chat.id,
    "To finish connecting your account, please share your phone number using the button below."
  );
}

async function handleContact(message: TelegramMessage) {
  const contact = message.contact!;
  if (contact.user_id !== message.from.id) {
    await sendTelegramMessage(
      message.chat.id,
      "Please share your own phone number using the button, not a forwarded contact."
    );
    return;
  }

  const phone = normalizePhone(contact.phone_number);
  if (!phone) {
    await sendTelegramMessage(message.chat.id, "That phone number didn't look valid. Please try again.");
    return;
  }

  const supabase = getSupabaseAdmin();

  const { data: linkToken } = await supabase
    .from("telegram_link_tokens")
    .select("id, user_id, expires_at")
    .eq("telegram_chat_id", message.chat.id)
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!linkToken || new Date(linkToken.expires_at).getTime() < Date.now()) {
    await sendTelegramMessage(
      message.chat.id,
      "Please start the linking process from Sudokult first by tapping \"Connect Telegram\"."
    );
    return;
  }

  const { data: phoneConflict } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("phone_number", phone)
    .maybeSingle();

  if (phoneConflict && phoneConflict.user_id !== linkToken.user_id) {
    await sendTelegramMessage(
      message.chat.id,
      "This phone number is already connected to a different Sudokult account."
    );
    return;
  }

  let targetUserId = linkToken.user_id as string | null;

  if (!targetUserId) {
    const { data: existingUserId } = await supabase.rpc("get_user_id_by_phone", { p_phone: phone });
    if (existingUserId) {
      targetUserId = existingUserId as string;
    } else {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        phone,
        phone_confirm: true,
      });
      if (createError || !created.user) {
        console.error("Failed to create Sudokult account for Telegram sign-up:", createError?.message);
        await sendTelegramMessage(message.chat.id, "Something went wrong creating your account. Please try again.");
        return;
      }
      targetUserId = created.user.id;
    }
  }

  const { error: upsertError } = await supabase.from("telegram_accounts").upsert(
    {
      user_id: targetUserId,
      telegram_user_id: message.from.id,
      telegram_chat_id: message.chat.id,
      phone_number: phone,
      linked_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    console.error("Failed to save telegram_accounts link:", upsertError.message);
    await sendTelegramMessage(message.chat.id, "Something went wrong linking your account. Please try again.");
    return;
  }

  await supabase.from("telegram_link_tokens").update({ used_at: new Date().toISOString() }).eq("id", linkToken.id);

  await sendTelegramMessage(message.chat.id, LINKED_MESSAGE);
}
