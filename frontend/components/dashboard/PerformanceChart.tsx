"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "Nov", value: 45 },
  { month: "Dec", value: 62 },
  { month: "Jan", value: 58 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 85 },
  { month: "Apr", value: 92 },
  { month: "May", value: 98 },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

export default function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">CTR Performance</h3>
          <p className="text-xs text-white/40 mt-0.5">Last 7 months</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1.5 rounded-full">
          <TrendingUp className="w-3 h-3" />
          +117% this quarter
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-40">
        {chartData.map((d, i) => {
          const height = (d.value / maxValue) * 100;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                className="w-full rounded-t-lg relative group cursor-pointer"
                style={{
                  background: i === chartData.length - 1
                    ? 'linear-gradient(to top, #6366f1, #8b5cf6)'
                    : 'linear-gradient(to top, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                  minHeight: '4px',
                  alignSelf: 'flex-end',
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a2e] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-white font-bold whitespace-nowrap z-10">
                  {d.value}%
                </div>
              </motion.div>
              <span className="text-[10px] text-white/30 font-medium">{d.month}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
