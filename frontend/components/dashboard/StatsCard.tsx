"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  index: number;
}

// Tiny sparkline data per card (decorative)
const SPARKLINES = [
  [40, 55, 50, 68, 72, 80, 92],
  [30, 45, 38, 55, 62, 58, 74],
  [60, 55, 70, 65, 78, 82, 88],
  [20, 35, 30, 48, 44, 60, 65],
];

export default function StatsCard({ label, value, change, trend, index }: StatsCardProps) {
  const sparkData = SPARKLINES[index % SPARKLINES.length];
  const maxSpark = Math.max(...sparkData);
  const isUp = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 hover:border-white/[0.12] hover:bg-white/[0.035] transition-all duration-300 overflow-hidden group"
    >
      {/* Subtle gradient glow on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl",
        isUp
          ? "bg-gradient-to-br from-emerald-500/[0.04] to-transparent"
          : "bg-gradient-to-br from-red-500/[0.04] to-transparent"
      )} />

      {/* Top accent line */}
      <div className={cn(
        "absolute top-0 left-4 right-4 h-px rounded-full",
        isUp
          ? "bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
          : "bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
      )} />

      <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest mb-3">{label}</p>

      <div className="flex items-end justify-between gap-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
            className="text-3xl font-black text-white tracking-tight leading-none"
          >
            {value}
          </motion.p>
          <div className={cn(
            "flex items-center gap-1 mt-2.5 text-xs font-semibold",
            isUp ? "text-emerald-400" : "text-red-400"
          )}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
            <span className="text-white/20 font-normal">vs last mo.</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
          <svg width="48" height="28" viewBox="0 0 48 28">
            {/* Area fill */}
            <defs>
              <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0.35" />
                <stop offset="100%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={sparkData.map((v, i) =>
                `${(i / (sparkData.length - 1)) * 48},${28 - (v / maxSpark) * 24}`
              ).join(" ")}
              fill="none"
              stroke={isUp ? "#10b981" : "#ef4444"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
