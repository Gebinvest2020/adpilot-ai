/**
 * lib/supabase/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side database helpers for persisting tool results and reading history.
 * All functions are safe to call from "use client" components.
 * Errors are caught and logged — callers get null/[] on failure so the UI
 * never breaks if Supabase is unavailable.
 */
"use client";

import { createClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TableName =
  | "rsa_generations"
  | "moderation_checks"
  | "ctr_analyses";

export interface HistoryRow {
  id: string;
  table: TableName;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  language?: "en" | "ru";
  country?: string;
  niche?: string;
}

// ─── Generation save ──────────────────────────────────────────────────────────

/**
 * Persist a tool result to Supabase.
 * Fire-and-forget safe: returns the new row ID or null on failure.
 *
 * @example
 *   saveGeneration("rsa_generations", { niche: "SaaS" }, result).catch(console.error);
 */
export async function saveGeneration(
  table: TableName,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Make sure there's an authenticated user before inserting
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error(`[db] saveGeneration(${table}): no authenticated user — insert skipped`);
      return null;
    }

    const { data, error } = await supabase
      .from(table)
      .insert({ user_id: user.id, input, output })
      .select("id")
      .single();

    if (error) {
      console.error(`[db] saveGeneration(${table}) INSERT failed:`, error);
      return null;
    }

    return (data as { id: string }).id;
  } catch (err) {
    console.error("[db] saveGeneration unexpected error:", err);
    return null;
  }
}

// ─── History fetch ────────────────────────────────────────────────────────────

/**
 * Fetch the current user's history from one or all tool tables.
 * Results are sorted newest-first across all requested tables.
 */
export async function fetchHistory(
  tables: TableName[] = ["rsa_generations", "moderation_checks", "ctr_analyses"],
  limit = 50
): Promise<HistoryRow[]> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const results = await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select("id, input, output, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.warn(`[db] fetchHistory(${table}):`, error.message);
          return [] as HistoryRow[];
        }

        return (data ?? []).map((row) => ({
          ...(row as { id: string; input: Record<string, unknown>; output: Record<string, unknown>; created_at: string }),
          table,
        }));
      })
    );

    // Merge all tables and sort by date descending
    return results
      .flat()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  } catch (err) {
    console.warn("[db] fetchHistory unexpected error:", err);
    return [];
  }
}

// ─── History delete ───────────────────────────────────────────────────────────

/**
 * Delete a single history record. RLS ensures users can only delete their own.
 */
export async function deleteHistoryRecord(
  table: TableName,
  id: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) console.warn(`[db] deleteHistoryRecord(${table}, ${id}):`, error.message);
    return !error;
  } catch {
    return false;
  }
}

// ─── Profile helpers ──────────────────────────────────────────────────────────

/**
 * Update the current user's profile row.
 */
export async function updateProfileInDb(
  userId: string,
  data: ProfileUpdate
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.warn("[db] updateProfileInDb:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
