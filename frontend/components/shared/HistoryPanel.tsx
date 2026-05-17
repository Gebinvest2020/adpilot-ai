"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Trash2, ChevronDown, Zap, BarChart2, Shield,
  X, RotateCcw, Loader2,
} from "lucide-react";
import {
  fetchHistory, deleteHistoryRecord,
  type HistoryRow, type TableName,
} from "@/lib/supabase/db";
import { relativeTime } from "@/lib/history";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const TABLE_CONFIG: Record<
  TableName,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    getPreview: (row: HistoryRow) => string;
    getScore: (row: HistoryRow) => number | undefined;
  }
> = {
  rsa_generations: {
    icon: Zap,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    getPreview: (row) => String(row.input.niche ?? "").slice(0, 60) || "RSA generation",
    getScore: (row) => {
      const mod = (row.output as { moderation?: { score?: number } }).moderation;
      return typeof mod?.score === "number" ? mod.score : undefined;
    },
  },
  moderation_checks: {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    getPreview: (row) =>
      String(row.input.adCopy ?? "").split("\n")[0].slice(0, 60) || "Moderation check",
    getScore: (row) => {
      const s = (row.output as { overallScore?: number }).overallScore;
      return typeof s === "number" ? s : undefined;
    },
  },
  ctr_analyses: {
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    getPreview: (row) =>
      String(row.input.adText ?? "").split("\n")[0].slice(0, 60) || "CTR analysis",
    getScore: (row) => {
      const s = (row.output as { overallScore?: number }).overallScore;
      return typeof s === "number" ? s : undefined;
    },
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HistoryPanelProps {
  table: TableName;
  /** Called when user clicks "Reopen" — passes back the saved Supabase row. */
  onReopen: (row: HistoryRow) => void;
  /** Increment to trigger a re-fetch from Supabase (e.g. after a new save). */
  refreshToken?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistoryPanel({
  table,
  onReopen,
  refreshToken = 0,
}: HistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const cfg = TABLE_CONFIG[table];
  const Icon = cfg.icon;

  const loadRows = useCallback(async () => {
    setLoading(true);
    const rows = await fetchHistory([table], 20);
    setItems(rows);
    setLoading(false);
  }, [table]);

  // Re-fetch whenever panel is open and refreshToken changes
  useEffect(() => {
    if (open) loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, refreshToken]);

  const handleToggle = () => setOpen((v) => !v);

  const handleRemove = async (row: HistoryRow, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic remove
    setItems((prev) => prev.filter((r) => r.id !== row.id));
    await deleteHistoryRecord(table, row.id);
  };

  const handleClear = async () => {
    const ids = items.map((r) => r.id);
    setItems([]);
    await Promise.all(ids.map((id) => deleteHistoryRecord(table, id)));
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden mt-4">

      {/* Header — always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Clock className="w-3.5 h-3.5 text-white/25" />
          <span className="text-[11px] font-bold text-white/35 uppercase tracking-widest">
            Recent
          </span>
          {items.length > 0 && (
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                cfg.bg,
                cfg.color,
                cfg.border
              )}
            >
              {items.length}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        </motion.div>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.05]">

              {/* Loading */}
              {loading ? (
                <div className="px-4 py-6 flex items-center justify-center gap-2 text-white/25">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Loading…</span>
                </div>
              ) : items.length === 0 ? (
                <div className="px-4 py-7 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-white/10" />
                  <p className="text-xs text-white/22">No history yet</p>
                  <p className="text-[10px] text-white/15 mt-1">
                    Results appear here after your first run
                  </p>
                </div>
              ) : (
                <div
                  className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-thumb]:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {items.map((row) => {
                    const preview = cfg.getPreview(row);
                    const score = cfg.getScore(row);
                    const ts = new Date(row.created_at).getTime();

                    return (
                      <div
                        key={row.id}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors"
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border",
                            cfg.bg,
                            cfg.border
                          )}
                        >
                          <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/65 truncate leading-snug">
                            {preview}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-white/22 font-mono">
                              {relativeTime(ts)}
                            </span>
                            {score !== undefined && (
                              <span
                                className={cn(
                                  "text-[9px] font-bold",
                                  score >= 80
                                    ? "text-emerald-400"
                                    : score >= 60
                                    ? "text-amber-400"
                                    : "text-red-400"
                                )}
                              >
                                {score}/100
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Row actions — visible on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => onReopen(row)}
                            title="Reopen"
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-indigo-400 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleRemove(row, e)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              {!loading && items.length > 0 && (
                <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[9px] text-white/18 font-mono">
                    {items.length} saved
                  </span>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-[10px] text-white/22 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
