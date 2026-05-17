"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Shield, BarChart2, ArrowRight, TrendingUp, Activity, Clock, Star } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentCampaigns from "@/components/dashboard/RecentCampaigns";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { useT } from "@/lib/i18n";
import { getHistory, getUsageStats, relativeTime, type HistoryItem, type UsageStats } from "@/lib/history";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

// ─── Activity item ────────────────────────────────────────────────────────────

const TYPE_META = {
  rsa: { label: "RSA Generated", icon: Zap,        color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/15", href: "/dashboard/rsa-generator" },
  ctr: { label: "CTR Analysis",  icon: BarChart2,   color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/15",   href: "/dashboard/ctr-analyzer" },
  moderation: { label: "Moderation Check", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15", href: "/dashboard/moderation-checker" },
};

function ActivityFeed({ items }: { items: HistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.06] py-10 text-center">
        <Activity className="w-6 h-6 mx-auto mb-3 text-white/15" />
        <p className="text-sm text-white/25">No activity yet</p>
        <p className="text-xs text-white/15 mt-1">Start using an AI tool to see your history here</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
      {items.map((item, i) => {
        const meta = TYPE_META[item.type];
        const Icon = meta.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.025] transition-colors group"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", meta.bg, "border", meta.border)}>
              <Icon className={cn("w-3.5 h-3.5", meta.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 truncate">{item.preview}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn("text-[10px] font-bold", meta.color)}>{meta.label}</span>
                {item.score !== undefined && (
                  <span className={cn(
                    "text-[10px] font-bold",
                    item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-amber-400" : "text-red-400"
                  )}>
                    {item.score}/100
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-white/22 font-mono">{relativeTime(item.timestamp)}</span>
              <Link
                href={meta.href}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white/60 transition-all"
              >
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Usage summary card ───────────────────────────────────────────────────────

function UsageSummary({ stats }: { stats: UsageStats }) {
  const items = [
    { label: "RSA generations",   value: stats.rsaCount,        color: "from-indigo-500 to-violet-600" },
    { label: "CTR analyses",      value: stats.ctrCount,        color: "from-blue-500 to-indigo-600"   },
    { label: "Moderation checks", value: stats.moderationCount, color: "from-emerald-500 to-cyan-600"  },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">AI Usage</p>
        <span className="text-[10px] text-white/20 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" /> This session
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/45">{item.label}</span>
              <span className="text-xs font-bold text-white/60">{item.value}</span>
            </div>
            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (item.value / Math.max(stats.totalGenerations, 1)) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
              />
            </div>
          </div>
        ))}
      </div>
      {stats.totalGenerations > 0 && (
        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-white/30">Total uses</span>
          <span className="text-sm font-black text-white">{stats.totalGenerations}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useT();
  const { user } = useUser();
  const [recentActivity, setRecentActivity] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<UsageStats>({
    totalGenerations: 0,
    rsaCount: 0,
    ctrCount: 0,
    moderationCount: 0,
    avgCtrScore: 0,
    avgSafetyScore: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    const items = getHistory();
    setRecentActivity(items.slice(0, 8));
    setStats(getUsageStats());
  }, []);

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
      stat: stats.rsaCount > 0 ? `${stats.rsaCount} generated` : "Generate now",
    },
    {
      title: t.sidebar.moderationChecker,
      description: t.dashboard.quickActionDescs[1],
      icon: Shield,
      href: "/dashboard/moderation-checker",
      gradient: "from-emerald-500 to-cyan-600",
      glow: "hover:shadow-emerald-500/20",
      stat: stats.avgSafetyScore > 0 ? `Avg: ${stats.avgSafetyScore}/100` : "Check now",
    },
    {
      title: t.sidebar.ctrAnalyzer,
      description: t.dashboard.quickActionDescs[2],
      icon: BarChart2,
      href: "/dashboard/ctr-analyzer",
      gradient: "from-blue-500 to-indigo-600",
      glow: "hover:shadow-blue-500/20",
      stat: stats.avgCtrScore > 0 ? `Avg CTR: ${stats.avgCtrScore}/100` : "Analyze now",
    },
  ];

  // Override stat labels from translations, inject real counts from localStorage
  const statCards = [
    {
      label: t.dashboard.statLabels[0] ?? "RSA Generations",
      value: stats.rsaCount > 0 ? String(stats.rsaCount) : "0",
      change: "+0",
      trend: "up" as const,
      index: 0,
    },
    {
      label: t.dashboard.statLabels[1] ?? "CTR Analyses",
      value: stats.ctrCount > 0 ? String(stats.ctrCount) : "0",
      change: "+0",
      trend: "up" as const,
      index: 1,
    },
    {
      label: t.dashboard.statLabels[2] ?? "Avg CTR Score",
      value: stats.avgCtrScore > 0 ? `${stats.avgCtrScore}` : "—",
      change: "+0",
      trend: "up" as const,
      index: 2,
    },
    {
      label: t.dashboard.statLabels[3] ?? "Safety Checks",
      value: stats.moderationCount > 0 ? String(stats.moderationCount) : "0",
      change: "+0",
      trend: "up" as const,
      index: 3,
    },
  ];

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
            {user.name.split(" ")[0]}
          </span>{" "}
          👋
        </h1>
        <p className="text-sm text-white/40 mt-0.5">{t.dashboard.subtitle}</p>
      </motion.div>

      {/* Stats — real data from localStorage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            index={i}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            {t.dashboard.quickActionsTitle}
          </h2>
          <span className="text-[10px] text-white/20">3 AI tools</span>
        </motion.div>
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
                  className={`relative block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:shadow-xl ${action.glow} group overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none rounded-2xl`} />
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent group-hover:via-white/20 transition-all duration-300" />

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-white/25 font-mono bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {action.stat}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{action.title}</h3>
                  <p className="text-xs text-white/38 leading-relaxed mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/25 group-hover:text-indigo-400 font-semibold transition-colors duration-200">
                    {t.dashboard.openTool}
                    <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Activity feed + Usage summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Recent Activity
            </h2>
            {recentActivity.length > 0 && (
              <span className="text-[10px] text-white/20 font-mono">{recentActivity.length} items</span>
            )}
          </div>
          <ActivityFeed items={recentActivity} />
        </div>
        <div className="space-y-4">
          <UsageSummary stats={stats} />
        </div>
      </div>

      {/* Charts + table */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        <PerformanceChart />
        <RecentCampaigns />
      </div>
    </div>
  );
}
