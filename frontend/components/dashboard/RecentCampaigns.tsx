"use client";

import { motion } from "framer-motion";
import { recentCampaigns } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useT } from "@/lib/i18n";

const statusColors = {
  active:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused:    "bg-amber-500/10  text-amber-400  border-amber-500/20",
  completed: "bg-blue-500/10   text-blue-400   border-blue-500/20",
};

export default function RecentCampaigns() {
  const t = useT();
  const { title, viewAll, columns, status } = t.dashboard.campaigns;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
          {viewAll} <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {columns.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentCampaigns.map((campaign, i) => (
              <motion.tr
                key={campaign.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {campaign.name}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border capitalize",
                      statusColors[campaign.status as keyof typeof statusColors]
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {status[campaign.status as keyof typeof status] ?? campaign.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-bold text-white">{campaign.ctr}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/50">{campaign.impressions}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/50">{campaign.clicks}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-bold text-emerald-400">
                    {campaign.improvement}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
