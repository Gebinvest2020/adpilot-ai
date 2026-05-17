"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ToastRenderer from "@/components/shared/ToastRenderer";
import { ToastProvider } from "@/lib/toast";
import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: '#050508' }}>
        <DashboardSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header
            className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] backdrop-blur-sm"
            style={{ background: 'rgba(10,10,16,0.85)' }}
          >
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/[0.07] bg-white/[0.04] text-sm text-white/70 placeholder-white/25 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="w-px h-4 bg-white/[0.08]" />
              <button className="relative p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </button>
              <div className="w-px h-5 bg-white/[0.08]" />
              <div className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] rounded-lg px-2 py-1.5 transition-all">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  AJ
                </div>
                <span className="text-sm text-white/60 font-medium hidden sm:block">Alex J.</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
            style={{ background: '#050508' }}
          >
            {children}
          </motion.main>
        </div>
      </div>

      {/* Global toast notifications */}
      <ToastRenderer />
    </ToastProvider>
  );
}
