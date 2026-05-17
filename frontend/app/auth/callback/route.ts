/**
 * app/auth/callback/route.ts
 * Handles two flows:
 *   1. Email confirmation links (Supabase sends these after signup)
 *   2. OAuth redirects (Google, GitHub — if configured in Supabase dashboard)
 *
 * Supabase appends ?code=<auth_code> to the redirect URL. This route
 * exchanges that code for a session, sets the session cookie, then
 * redirects the user to the dashboard (or a custom "next" path).
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Support custom redirect target (e.g. /auth/callback?next=/dashboard/settings)
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send to login with an error indicator
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
