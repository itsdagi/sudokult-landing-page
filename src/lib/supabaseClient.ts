import { createClient } from "@supabase/supabase-js";

// Fall back to placeholders so builds/prerendering don't crash before the
// real values are configured — real requests will simply fail until they are.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/** Browser-only Supabase client. Session is persisted to localStorage. */
export const supabase = createClient(url, anonKey);
