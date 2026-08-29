import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthenticatedUserId } from "@/lib/requestContext";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return Response.json({ error: "Please sign in first." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("telegram_accounts")
    .select("linked_at, last_used_at")
    .eq("user_id", userId)
    .maybeSingle();

  return Response.json({
    connected: !!data,
    linkedAt: data?.linked_at ?? null,
    lastUsedAt: data?.last_used_at ?? null,
  });
}
