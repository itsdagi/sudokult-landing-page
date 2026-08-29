import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthenticatedUserId } from "@/lib/requestContext";

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in first." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("telegram_accounts").delete().eq("user_id", userId);

  if (error) {
    return Response.json({ error: "Could not disconnect Telegram. Please try again." }, { status: 500 });
  }

  return Response.json({ success: true });
}
