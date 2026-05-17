"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useUser } from "@/hooks/useUser";

/**
 * Dashboard top navigation bar.
 * Reads the authenticated user from the global UserContext — no hardcoded names.
 */
export default function DashboardTopbar() {
  const { user } = useUser();

  return (
    <header
      className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] backdrop-blur-sm"
      style={{ background: "rgba(10,10,16,0.85)" }}
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

        {/* User avatar — links to settings */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] rounded-lg px-2 py-1.5 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user.initials}
          </div>
          <span className="text-sm text-white/60 font-medium hidden sm:block">
            {user.name.split(" ")[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}
