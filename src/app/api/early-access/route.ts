import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OWNER_EMAIL = "dagimalemux@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function saveToSupabase(email: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase env vars missing — skipping database save.");
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.from("early_access").insert({ email });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase insert exception:", err);
    return false;
  }
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

async function notifyOwner(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping owner notification email.");
    return false;
  }

  const from = process.env.RESEND_FROM || "Sudokult <onboarding@resend.dev>";
  const safeEmail = escapeHtml(email);
  const initial = safeEmail.charAt(0).toUpperCase();
  const timestamp = formatTimestamp(new Date());

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#0A0A0A;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#0A0A0A;">
      A new player just joined the Sudokult early-access waitlist.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

            <!-- Header -->
            <tr>
              <td style="padding:0 8px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-weight:800;font-size:15px;letter-spacing:0.18em;color:#FFFFFF;">SUDOKULT</td>
                    <td align="right">
                      <span style="display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.16em;color:#DD5123;border:1px solid rgba(221,81,35,0.45);border-radius:999px;padding:5px 12px;">EARLY ACCESS</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td style="background-color:#121212;border:1px solid #232323;border-radius:16px;padding:34px 36px 30px;">
                <div style="font-size:30px;line-height:1;">⚔️</div>
                <h1 style="margin:16px 0 10px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-weight:800;font-size:26px;line-height:1.2;color:#FFFFFF;">New duelist on the waitlist</h1>
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#9C9C9C;">A new player just entered the arena and claimed their spot for early testing.</p>

                <!-- Signup card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#1B1B1B;border:1px solid #2A2A2A;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="34" valign="middle" style="width:34px;">
                            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#DD5123,#8E24AA);color:#FFFFFF;font-family:Helvetica,Arial,sans-serif;font-weight:800;font-size:16px;line-height:34px;text-align:center;">${initial}</div>
                          </td>
                          <td style="padding-left:14px;" valign="middle">
                            <div style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.14em;color:#6E6E6E;text-transform:uppercase;">New signup</div>
                            <div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:15px;font-weight:700;color:#FFFFFF;word-break:break-all;">${safeEmail}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Reward strip -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                  <tr>
                    <td style="padding:14px 18px;background-color:rgba(221,81,35,0.08);border:1px solid rgba(221,81,35,0.25);border-radius:12px;">
                      <span style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#FFD700;font-weight:700;">🪙 500 Cipher Coins</span>
                      <span style="color:#555555;font-family:Helvetica,Arial,sans-serif;font-size:13px;">&nbsp;+&nbsp;</span>
                      <span style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#FFFFFF;font-weight:700;">🎖️ Exclusive Beta Badge</span>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td>
                      <a href="mailto:${safeEmail}" style="display:inline-block;background:linear-gradient(90deg,#DD5123,#B8421C);color:#FFFFFF;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 24px;">Reply to ${safeEmail}</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:26px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#6E6E6E;">Signed up ${timestamp} UTC</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 8px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-top:1px solid #1E1E1E;padding-top:20px;">
                      <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8A8A8A;text-align:center;">Think Fast • Solve Smarter • Outsmart Your Opponent</div>
                      <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#555555;text-align:center;margin-top:6px;">© 2026 Sudokult · All rights reserved</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [OWNER_EMAIL],
        subject: `⚔️ New duelist joined early access — ${email}`,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend notification failed:", res.status, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend notification error:", err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasResend = !!process.env.RESEND_API_KEY;

    if (!hasSupabase && !hasResend) {
      return Response.json(
        { error: "Server is not configured for email collection yet." },
        { status: 500 }
      );
    }

    const saved = await saveToSupabase(email);
    const notified = await notifyOwner(email);

    if (!saved && !notified) {
      return Response.json(
        { error: "Could not save your email. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
