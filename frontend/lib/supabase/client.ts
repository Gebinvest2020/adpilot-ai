/**
 * lib/supabase/client.ts
 * Browser-side Supabase client — safe to use in "use client" components.
 * createBrowserClient() deduplicates: calling this multiple times returns
 * the same singleton instance, so it's safe to call in component bodies.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
