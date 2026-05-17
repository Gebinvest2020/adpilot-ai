/**
 * lib/supabase/client.ts
 * Browser-side Supabase client — explicit module-level singleton.
 * One instance is created for the entire browser session and shared
 * across all imports. Safe to call from any "use client" module.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (_client) return _client;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return _client;
}
