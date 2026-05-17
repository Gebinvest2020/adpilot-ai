/**
 * app/dashboard/layout.tsx — Server Component
 *
 * `force-dynamic` opts ALL dashboard pages out of static prerendering.
 * This is required because:
 *   1. Dashboard pages require an authenticated Supabase session.
 *   2. The UserProvider calls createBrowserClient() which needs env vars
 *      that may not be present at build time.
 *   3. Middleware (proxy.ts) handles auth-based redirects at request time.
 */
export const dynamic = "force-dynamic";

import DashboardShell from "@/components/layout/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
