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
const W = 280;
const H = 120;
const PAD = 8;

function buildPath(filled: boolean) {
  const pts = chartData.map((d, i) => {
    const x = PAD + (i / (chartData.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - d.value / maxValue) * (H - PAD * 2);
    return [x, y] as [number, number];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  if (!filled) return line;
  return `${line} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;
}

export default function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 h-full"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white leading-none mb-1">CTR Performance</h3>
          <p className="text-[11px] text-white/30">Last 7 months</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          +117%
        </div>
      </div>

      {/* Area chart */}
      <div className="relative mb-3">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-28"
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={PAD}
              y1={PAD + (1 - t) * (H - PAD * 2)}
              x2={W - PAD}
              y2={PAD + (1 - t) * (H - PAD * 2)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <motion.path
            d={buildPath(true)}
            fill="url(#chartFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Line */}
          <motion.path
            d={buildPath(false)}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          />

          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {chartData.map((d, i) => {
            const x = PAD + (i / (chartData.length - 1)) * (W - PAD * 2);
            const y = PAD + (1 - d.value / maxValue) * (H - PAD * 2);
            const isLast = i === chartData.length - 1;
            return (
              <motion.circle
                key={d.month}
                cx={x}
                cy={y}
                r={isLast ? 4 : 2.5}
                fill={isLast ? "#a78bfa" : "#6366f1"}
                stroke={isLast ? "rgba(167,139,250,0.3)" : "transparent"}
                strokeWidth={isLast ? 4 : 0}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.07, type: "spring", stiffness: 400 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Month labels */}
      <div className="flex justify-between px-1">
        {chartData.map((d) => (
          <span key={d.month} className="text-[9px] text-white/25 font-medium">
            {d.month}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
