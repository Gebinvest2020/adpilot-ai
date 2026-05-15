"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  index: number;
}

export default function StatsCard({ label, value, change, trend, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
    >
      <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
          trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          <TrendingUp className="w-3 h-3" />
          {change}
        </div>
      </div>
    </motion.div>
  );
}
