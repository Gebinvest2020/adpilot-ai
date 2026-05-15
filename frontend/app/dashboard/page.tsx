"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Shield, BarChart2, ArrowRight } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentCampaigns from "@/components/dashboard/RecentCampaigns";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { dashboardStats } from "@/lib/mock-data";
import { useT } from "@/lib/i18n";

export default function DashboardPage() {
  const t = useT();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t.dashboard.greetingMorning
      : hour < 17
      ? t.dashboard.greetingAfternoon
      : t.dashboard.greetingEvening;

  const quickActions = [
    {
      title: t.sidebar.rsaGenerator,
      description: t.dashboard.quickActionDescs[0],
      icon: Zap,
      href: "/dashboard/rsa-generator",
      gradient: "from-indigo-500 to-violet-600",
      glow: "hover:shadow-indigo-500/20",
    },
    {
      title: t.sidebar.moderationChecker,
      description: t.dashboard.quickActionDescs[1],
      icon: Shield,
      href: "/dashboard/moderation-checker",
      gradient: "from-emerald-500 to-cyan-600",
      glow: "hover:shadow-emerald-500/20",
    },
    {
      title: t.sidebar.ctrAnalyzer,
      description: t.dashboard.quickActionDescs[2],
      icon: BarChart2,
      href: "/dashboard/ctr-analyzer",
      gradient: "from-blue-500 to-indigo-600",
      glow: "hover:shadow-blue-500/20",
    },
  ];

  // Override stat labels from translations
  const translatedStats = dashboardStats.map((stat, i) => ({
    ...stat,
    label: t.dashboard.statLabels[i] ?? stat.label,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black text-white">
          {greeting},{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            Alex
          </span>{" "}
          👋
        </h1>
        <p className="text-sm text-white/40 mt-0.5">{t.dashboard.subtitle}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {translatedStats.map((stat, i) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as "up" | "down"}
            index={i}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4"
        >
          {t.dashboard.quickActionsTitle}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Link
                  href={action.href}
                  className={`block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:shadow-xl ${action.glow} group`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.dashboard.openTool} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts + table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-2">
          <RecentCampaigns />
        </div>
      </div>
    </div>
  );
}
