import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verifies a Supabase Auth Hook request using the Standard Webhooks scheme
 * Supabase signs these with: headers `webhook-id`, `webhook-timestamp`,
 * `webhook-signature` (space-separated `v1,<base64>` values), secret shape
 * `whsec_<base64>`, signed content `${id}.${timestamp}.${rawBody}`.
 */
export function verifyAuthHookSignature(params: {
  rawBody: string;
  headers: Headers;
  secret: string;
}): boolean {
  const { rawBody, headers, secret } = params;

  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) {
    console.error("Auth hook signature check failed: missing webhook-id/timestamp/signature header(s).");
    return false;
  }

  // Reject stale requests (5 minute tolerance).
  const ts = Number(timestamp);
  const skew = Math.abs(Date.now() / 1000 - ts);
  if (!Number.isFinite(ts) || skew > 300) {
    console.error(`Auth hook signature check failed: timestamp skew ${skew}s exceeds 300s tolerance.`);
    return false;
  }

  const secretKey = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  const secretBytes = Buffer.from(secretKey, "base64");

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes).update(signedContent).digest();

  const candidates = signatureHeader.split(" ");
  for (const candidate of candidates) {
    const [, sig] = candidate.split(",");
    if (!sig) continue;
    let actual: Buffer;
    try {
      actual = Buffer.from(sig, "base64");
    } catch {
      continue;
    }
    if (actual.length === expected.length && timingSafeEqual(actual, expected)) {
      return true;
    }
  }
  console.error(
    `Auth hook signature check failed: no candidate signature matched (secret starts with 'whsec_': ${secret.startsWith("whsec_")}, secret length: ${secret.length}).`
  );
  return false;
}
