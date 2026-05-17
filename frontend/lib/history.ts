// ─── Persistent localStorage history system ─────────────────────────────────
// Stores up to MAX_ITEMS across all tools. No external dependencies.

export type HistoryType = "rsa" | "ctr" | "moderation";

export interface HistoryItem {
  id: string;
  type: HistoryType;
  timestamp: number;
  /** Short text shown in the history list */
  preview: string;
  /** Numeric score (CTR / moderation safety) — optional */
  score?: number;
  /** Serialised result returned by the tool */
  result: unknown;
}

const STORAGE_KEY = "adpilot_history_v1";
const MAX_ITEMS = 20;

function load(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: HistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* quota exceeded — silently ignore */ }
}

/** Add a new entry and return the full list. */
export function addHistoryItem(
  item: Omit<HistoryItem, "id" | "timestamp">
): HistoryItem[] {
  const existing = load();
  const next: HistoryItem[] = [
    {
      ...item,
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    },
    ...existing,
  ].slice(0, MAX_ITEMS);
  persist(next);
  return next;
}

/** Remove a single item by id. */
export function removeHistoryItem(id: string): HistoryItem[] {
  const next = load().filter((i) => i.id !== id);
  persist(next);
  return next;
}

/** Wipe all history. */
export function clearAllHistory(): void {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

/** Read the full list. */
export function getHistory(): HistoryItem[] {
  return load();
}

/** Read only items matching a given type. */
export function getHistoryByType(type: HistoryType): HistoryItem[] {
  return load().filter((i) => i.type === type);
}

/** Human-readable relative time label (e.g. "2 min ago"). */
export function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/** Usage stats derived from history — used by the dashboard. */
export interface UsageStats {
  totalGenerations: number;
  rsaCount: number;
  ctrCount: number;
  moderationCount: number;
  avgCtrScore: number;
  avgSafetyScore: number;
  thisWeek: number;
}

export function getUsageStats(): UsageStats {
  const items = load();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const rsaItems  = items.filter((i) => i.type === "rsa");
  const ctrItems  = items.filter((i) => i.type === "ctr");
  const modItems  = items.filter((i) => i.type === "moderation");

  const ctrScores = ctrItems.map((i) => i.score ?? 0).filter(Boolean);
  const modScores = modItems.map((i) => i.score ?? 0).filter(Boolean);

  return {
    totalGenerations: items.length,
    rsaCount:         rsaItems.length,
    ctrCount:         ctrItems.length,
    moderationCount:  modItems.length,
    avgCtrScore:  ctrScores.length ? Math.round(ctrScores.reduce((a, b) => a + b, 0) / ctrScores.length) : 0,
    avgSafetyScore: modScores.length ? Math.round(modScores.reduce((a, b) => a + b, 0) / modScores.length) : 0,
    thisWeek: items.filter((i) => i.timestamp > weekAgo).length,
  };
}
