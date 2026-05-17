/**
 * proxy.ts  (Next.js 16 — replaces the old "middleware.ts" convention)
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs on every non-static request. Two responsibilities:
 *   1. Refresh the Supabase session cookie so it never silently expires.
 *   2. Protect /dashboard/* — redirect unauthenticated visitors to /login.
 *      Redirect authenticated visitors away from /login and /register.
 *
 * IMPORTANT: Always return `supabaseResponse` (not a plain NextResponse.next())
 * so the refreshed session cookies are propagated to the browser.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 uses "proxy" as the exported function name
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() refreshes the session token if needed.
  // Do NOT use getSession() here — it can serve stale data.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Protect dashboard routes ──────────────────────────────────────────────
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from auth pages ─────────────────────
  if (user && (pathname === "/login" || pathname === "/register")) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
