import { randomBytes, createHash } from "crypto";

const E164_RE = /^\+[1-9]\d{6,14}$/;

/** Normalizes user/Telegram-supplied phone input to E.164 (+<digits>). */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim().replace(/[\s()-]/g, "");
  const candidate = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  return E164_RE.test(candidate) ? candidate : null;
}

export function generateLinkToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  return token;
}

async function callTelegramApi(method: string, payload: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(`Telegram API ${method} failed: ${data?.description ?? res.statusText}`);
  }
  return data.result;
}

export async function sendTelegramMessage(chatId: number, text: string) {
  return callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

export async function requestTelegramContact(chatId: number, text: string) {
  return callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: {
      keyboard: [[{ text: "Share phone number", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

/** Sends the OTP without ever writing it to logs — caller must not log `otp` either. */
export async function sendTelegramOtp(chatId: number, otp: string) {
  return sendTelegramMessage(
    chatId,
    `🔐 Your Sudokult verification code: <b>${otp}</b>\n\nExpires in 5 minutes. Do not share this code with anyone.`
  );
}
