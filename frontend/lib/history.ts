/**
 * lib/history.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Persistent localStorage history for all three AI tools.
 * Safe to import in SSR context — all functions guard against window.
 */

export type HistoryType = "rsa" | "ctr" | "moderation";

export interface HistoryItem {
  id: string;
  type: HistoryType;
  timestamp: number;
  /** Short text preview shown in the history list */
  preview: string;
  /** Numeric score (CTR overallScore / moderation overallScore) */
  score?: number;
  /** The full tool result — stored so "Reopen" can restore it */
  result: unknown;
}

const STORAGE_KEY = "adpilot_history_v1";
const MAX_ITEMS   = 20;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

/** Generate a collision-resistant ID without relying on crypto.randomUUID. */
function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function load(): HistoryItem[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: HistoryItem[]): boolean {
  if (!isClient()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    console.warn("[history] Failed to persist:", e);
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Add a new item at the top of the list (newest-first). Returns the updated list. */
export function addHistoryItem(
  item: Omit<HistoryItem, "id" | "timestamp">
): HistoryItem[] {
  const existing = load();
  const newItem: HistoryItem = {
    ...item,
    id:        makeId(),
    timestamp: Date.now(),
  };
  const next = [newItem, ...existing].slice(0, MAX_ITEMS);
  persist(next);
  return next;
}

/** Remove a single item by id. Returns the updated list. */
export function removeHistoryItem(id: string): HistoryItem[] {
  const next = load().filter((i) => i.id !== id);
  persist(next);
  return next;
}

/** Remove all items of a given type. Returns the updated list. */
export function clearHistoryByType(type: HistoryType): HistoryItem[] {
  const next = load().filter((i) => i.type !== type);
  persist(next);
  return next;
}

/** Wipe the entire history. */
export function clearAllHistory(): void {
  if (isClient()) localStorage.removeItem(STORAGE_KEY);
}

/** Read the full list (newest-first). */
export function getHistory(): HistoryItem[] {
  return load();
}

/** Read only items matching a given type. */
export function getHistoryByType(type: HistoryType): HistoryItem[] {
  return load().filter((i) => i.type === type);
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/** Human-readable relative timestamp, e.g. "3m ago". */
export function relativeTime(ts: number): string {
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface UsageStats {
  totalGenerations: number;
  rsaCount:         number;
  ctrCount:         number;
  moderationCount:  number;
  avgCtrScore:      number;
  avgSafetyScore:   number;
  thisWeek:         number;
}

export function getUsageStats(): UsageStats {
  const items   = load();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const rsa = items.filter((i) => i.type === "rsa");
  const ctr = items.filter((i) => i.type === "ctr");
  const mod = items.filter((i) => i.type === "moderation");

  const avg = (arr: HistoryItem[]) => {
    const scores = arr.map((i) => i.score ?? 0).filter((s) => s > 0);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  return {
    totalGenerations: items.length,
    rsaCount:         rsa.length,
    ctrCount:         ctr.length,
    moderationCount:  mod.length,
    avgCtrScore:      avg(ctr),
    avgSafetyScore:   avg(mod),
    thisWeek:         items.filter((i) => i.timestamp > weekAgo).length,
  };
}
