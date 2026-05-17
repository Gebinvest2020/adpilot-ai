"use client";

import { motion } from "framer-motion";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import ToastRenderer from "@/components/shared/ToastRenderer";
import { ToastProvider } from "@/lib/toast";
import { UserProvider } from "@/app/providers/UserProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* UserProvider must be outermost so every child (Sidebar, Topbar, pages)
       can call useUser() — they are all rendered inside this Provider. */
    <UserProvider>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden" style={{ background: "#050508" }}>
          <DashboardSidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardTopbar />

            {/* Page content */}
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

        {/* Global toast notifications */}
        <ToastRenderer />
      </ToastProvider>
    </UserProvider>
  );
}
