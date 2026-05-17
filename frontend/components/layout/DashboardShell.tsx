"use client";

/**
 * components/layout/DashboardShell.tsx
 * Client-side wrapper for all dashboard pages.
 * Provides UserProvider (Supabase auth/profile) and ToastProvider.
 * Kept separate from app/dashboard/layout.tsx so the layout can remain a
 * Server Component and export `dynamic = 'force-dynamic'`.
 */

import { motion } from "framer-motion";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import ToastRenderer from "@/components/shared/ToastRenderer";
import { ToastProvider } from "@/lib/toast";
import { UserProvider } from "@/app/providers/UserProvider";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden" style={{ background: "#050508" }}>
          <DashboardSidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardTopbar />

            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto"
              style={{ background: "#050508" }}
            >
              {children}
            </motion.main>
          </div>
        </div>

        <ToastRenderer />
      </ToastProvider>
    </UserProvider>
  );
}
