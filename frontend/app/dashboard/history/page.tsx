"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, BarChart2, Clock, Trash2, ChevronDown,
  ChevronUp, Database, RefreshCw,
} from "lucide-react";
import {
  fetchHistory, deleteHistoryRecord,
  type HistoryRow, type TableName,
} from "@/lib/supabase/db";
import { relativeTime } from "@/lib/history";
import { cn } from "@/lib/utils";

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabId = "all" | TableName;

const TABS: { id: TabId; label: string; icon: React.ElementType; tables: TableName[] }[] = [
  { id: "all",               label: "All",       icon: Database,  tables: ["rsa_generations", "moderation_checks", "ctr_analyses"] },
  { id: "rsa_generations",   label: "RSA",       icon: Zap,       tables: ["rsa_generations"] },
  { id: "moderation_checks", label: "Moderation",icon: Shield,    tables: ["moderation_checks"] },
  { id: "ctr_analyses",      label: "CTR",       icon: BarChart2, tables: ["ctr_analyses"] },
];

const TABLE_META: Record<TableName, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  rsa_generations:   { label: "RSA Generation",    icon: Zap,       color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20"  },
  moderation_checks: { label: "Moderation Check",  icon: Shield,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ctr_analyses:      { label: "CTR Analysis",      icon: BarChart2, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPreview(row: HistoryRow): string {
  const i = row.input;
  if (row.table === "rsa_generations")   return String(i.niche   ?? "").slice(0, 80) || "RSA generation";
  if (row.table === "moderation_checks") return String(i.adCopy  ?? "").split("\n")[0].slice(0, 80) || "Moderation check";
  if (row.table === "ctr_analyses")      return String(i.adText  ?? "").split("\n")[0].slice(0, 80) || "CTR analysis";
  return "Unknown";
}

function getScore(row: HistoryRow): number | null {
  const o = row.output as Record<string, unknown>;
  if (row.table === "rsa_generations") {
    const mod = o.moderation as Record<string, unknown> | undefined;
    return typeof mod?.score === "number" ? mod.score : null;
  }
  if (typeof o.overallScore === "number") return o.overallScore;
  return null;
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  return <span className={cn("text-[10px] font-bold", color)}>{score}/100</span>;
}

// ─── Row component ────────────────────────────────────────────────────────────

function HistoryRowCard({
  row,
  onDelete,
}: {
  row: HistoryRow;
  onDelete: (row: HistoryRow) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const meta = TABLE_META[row.table];
  const Icon = meta.icon;
  const preview = getPreview(row);
  const score = getScore(row);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    const ok = await deleteHistoryRecord(row.table, row.id);
    if (ok) onDelete(row);
    else setDeleting(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      className="rounded-xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors group"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Type icon */}
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border", meta.bg, meta.border)}>
          <Icon className={cn("w-3.5 h-3.5", meta.color)} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/70 truncate">{preview}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn("text-[10px] font-bold", meta.color)}>{meta.label}</span>
            <ScoreBadge score={score} />
            <span className="text-[9px] text-white/25 font-mono">
              {relativeTime(new Date(row.created_at).getTime())}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.08] text-white/25 hover:text-red-400 transition-all disabled:opacity-30"
            title="Delete"
          >
            {deleting
              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              : <Trash2 className="w-3.5 h-3.5" />
            }
          </button>
          <div className="text-white/20">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.05] px-4 py-4 space-y-4">
              {/* Input */}
              <div>
                <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Input</p>
                <pre className="text-xs text-white/50 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {JSON.stringify(row.input, null, 2)}
                </pre>
              </div>

              {/* Key output fields — not the full blob */}
              <OutputSummary row={row} />

              <p className="text-[9px] text-white/18 font-mono">
                ID: {row.id} · {new Date(row.created_at).toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Shows a human-readable summary of the output without dumping the full JSON. */
function OutputSummary({ row }: { row: HistoryRow }) {
  const o = row.output as Record<string, unknown>;

  if (row.table === "rsa_generations") {
    const headlines = (o.headlines as { text: string }[] | undefined) ?? [];
    const descs = (o.descriptions as { text: string }[] | undefined) ?? [];
    return (
      <div>
        <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">
          Output — {headlines.length} headlines, {descs.length} descriptions
        </p>
        <div className="space-y-1">
          {headlines.slice(0, 3).map((h, i) => (
            <p key={i} className="text-xs text-white/55 bg-white/[0.02] rounded px-2.5 py-1.5 font-mono truncate">
              {i + 1}. {h.text}
            </p>
          ))}
          {headlines.length > 3 && (
            <p className="text-[10px] text-white/25 pl-2.5">+{headlines.length - 3} more</p>
          )}
        </div>
      </div>
    );
  }

  if (row.table === "moderation_checks") {
    const flags = (o.flags as unknown[] | undefined)?.length ?? 0;
    const score = typeof o.overallScore === "number" ? o.overallScore : null;
    const risk  = String(o.riskLevel ?? "—");
    return (
      <div>
        <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Output</p>
        <div className="flex items-center gap-4 text-sm">
          {score !== null && (
            <div className="text-center">
              <p className={cn("text-lg font-black", score >= 75 ? "text-emerald-400" : score >= 45 ? "text-amber-400" : "text-red-400")}>{score}</p>
              <p className="text-[9px] text-white/30">Safety score</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-lg font-black text-white/60">{flags}</p>
            <p className="text-[9px] text-white/30">Flags</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white/60 capitalize">{risk}</p>
            <p className="text-[9px] text-white/30">Risk level</p>
          </div>
        </div>
      </div>
    );
  }

  if (row.table === "ctr_analyses") {
    const score = typeof o.overallScore === "number" ? o.overallScore : null;
    const recs  = (o.recommendations as string[] | undefined)?.slice(0, 2) ?? [];
    return (
      <div>
        <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Output</p>
        {score !== null && (
          <p className={cn("text-2xl font-black mb-2", score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400")}>
            {score}<span className="text-sm text-white/30 font-normal">/100 CTR score</span>
          </p>
        )}
        {recs.map((r, i) => (
          <p key={i} className="text-xs text-white/50 mt-1">• {r}</p>
        ))}
      </div>
    );
  }

  return null;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabId }) {
  const meta = tab !== "all" ? TABLE_META[tab] : null;
  const Icon = meta?.icon ?? Database;
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.06] py-16 text-center">
      <Icon className="w-8 h-8 mx-auto mb-3 text-white/10" />
      <p className="text-sm text-white/25">No history yet</p>
      <p className="text-xs text-white/15 mt-1">
        Results will appear here after your first {tab === "all" ? "AI" : tab.replace("_", " ")} run
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [rows, setRows]           = useState<HistoryRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState<string | null>(null);

  const currentTables = TABS.find((t) => t.id === activeTab)?.tables ??
    ["rsa_generations", "moderation_checks", "ctr_analyses"];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(currentTables, 100);
      setRows(data);
    } catch {
      setError("Failed to load history. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const handleDelete = (deleted: HistoryRow) => {
    setRows((prev) => prev.filter((r) => r.id !== deleted.id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[22px] font-black text-white tracking-tight">History</h1>
            <p className="text-sm text-white/30 mt-0.5">
              All your AI generations — persisted in Supabase across devices
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all disabled:opacity-40"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {/* Stats strip */}
        {!loading && rows.length > 0 && (
          <div className="flex items-center gap-3 mt-4">
            {TABS.slice(1).map((tab) => {
              const count = rows.filter((r) =>
                tab.tables.includes(r.table)
              ).length;
              const meta = TABLE_META[tab.tables[0]];
              const Icon = tab.icon;
              return (
                <div key={tab.id} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs", meta.bg, meta.border)}>
                  <Icon className={cn("w-3 h-3", meta.color)} />
                  <span className={cn("font-bold", meta.color)}>{count}</span>
                  <span className="text-white/35">{tab.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-white/40 hover:text-white/65"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400 flex items-center gap-3">
          <span>{error}</span>
          <button onClick={load} className="ml-auto text-xs underline">Retry</button>
        </div>
      ) : rows.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {rows.map((row) => (
              <HistoryRowCard key={row.id} row={row} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer info */}
      {!loading && rows.length > 0 && (
        <p className="text-[10px] text-white/18 font-mono text-center mt-6">
          {rows.length} records · stored in Supabase with Row Level Security
        </p>
      )}
    </div>
  );
}
