"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, ChevronDown, Zap, BarChart2, Shield, X, RotateCcw } from "lucide-react";
import {
  getHistoryByType,
  removeHistoryItem,
  clearHistoryByType,
  relativeTime,
  type HistoryItem,
  type HistoryType,
} from "@/lib/history";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<HistoryType, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}> = {
  rsa: {
    icon: Zap,
    color:  "text-indigo-400",
    bg:     "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  ctr: {
    icon: BarChart2,
    color:  "text-blue-400",
    bg:     "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  moderation: {
    icon: Shield,
    color:  "text-emerald-400",
    bg:     "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HistoryPanelProps {
  type: HistoryType;
  /** Called when user clicks "Reopen" — passes back the saved result object. */
  onReopen: (item: HistoryItem) => void;
  /** Increment to trigger a re-read from localStorage (e.g. after a new save). */
  refreshToken?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HistoryPanel({ type, onReopen, refreshToken = 0 }: HistoryPanelProps) {
  const [open, setOpen]   = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const cfg  = TYPE_CONFIG[type];
  const Icon = cfg.icon;

  // Re-read localStorage whenever the panel is opened or refreshToken changes
  useEffect(() => {
    setItems(getHistoryByType(type));
  }, [type, refreshToken]);

  // Also re-read when the user opens the panel
  const handleToggle = () => {
    if (!open) setItems(getHistoryByType(type));
    setOpen((v) => !v);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = removeHistoryItem(id);
    setItems(next.filter((i) => i.type === type));
  };

  const handleClear = () => {
    clearHistoryByType(type);   // ← uses the fixed util, not manual reconstruction
    setItems([]);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">

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
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
              cfg.bg, cfg.color, cfg.border
            )}>
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

              {items.length === 0 ? (
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
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors"
                    >
                      {/* Icon */}
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border",
                        cfg.bg, cfg.border
                      )}>
                        <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/65 truncate leading-snug">
                          {item.preview}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-white/22 font-mono">
                            {relativeTime(item.timestamp)}
                          </span>
                          {item.score !== undefined && (
                            <span className={cn(
                              "text-[9px] font-bold",
                              item.score >= 80 ? "text-emerald-400"
                              : item.score >= 60 ? "text-amber-400"
                              : "text-red-400"
                            )}>
                              {item.score}/100
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row actions — visible on hover */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => onReopen(item)}
                          title="Reopen"
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-indigo-400 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleRemove(item.id, e)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[9px] text-white/18 font-mono">
                    {items.length} / 20 saved
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
