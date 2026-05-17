"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap, LayoutDashboard, Shield, BarChart2, History,
  Settings, ChevronLeft, ChevronRight, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

export default function DashboardSidebar() {
  const t = useT();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: t.sidebar.dashboard,         href: "/dashboard",                    icon: LayoutDashboard },
    { label: t.sidebar.rsaGenerator,      href: "/dashboard/rsa-generator",      icon: Zap },
    { label: t.sidebar.moderationChecker, href: "/dashboard/moderation-checker", icon: Shield },
    { label: t.sidebar.ctrAnalyzer,       href: "/dashboard/ctr-analyzer",       icon: BarChart2 },
    { label: t.sidebar.history,           href: "/dashboard/history",            icon: History },
    { label: t.sidebar.settings,          href: "/dashboard/settings",           icon: Settings },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-screen border-r border-white/[0.06] flex-shrink-0"
      style={{ background: "#0d0d14" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base font-bold whitespace-nowrap overflow-hidden"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                AdPilot
              </span>
              <span className="text-white/40 text-sm font-normal ml-0.5">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-indigo-400" : "")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="border-t border-white/[0.06] p-2 space-y-1">
        {/* Settings link */}
        <Link href="/dashboard/settings">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer",
              collapsed ? "justify-center" : ""
            )}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white">
              {user.initials || <User className="w-3.5 h-3.5" />}
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{t.sidebar.plan}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/35 hover:text-red-400 hover:bg-red-500/[0.07] transition-all",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium whitespace-nowrap overflow-hidden"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1a1a2e] border border-white/[0.12] flex items-center justify-center hover:bg-[#252538] transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white/60" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white/60" />
        )}
      </button>
    </motion.aside>
  );
}
