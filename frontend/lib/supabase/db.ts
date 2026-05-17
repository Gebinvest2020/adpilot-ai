/**
 * lib/supabase/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side database helpers for persisting tool results and reading history.
 * All functions are safe to call from "use client" components.
 */

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely convert any value to a plain JSON-serializable object.
 * Drops undefined values, converts Date → string, throws on circular refs.
 */
function toJsonSafe(value: unknown): Record<string, unknown> {
  try {
    return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
  } catch (e) {
    console.error("[db] toJsonSafe: could not serialize value", e, value);
    throw e;
  }
}

// ─── Generation save ──────────────────────────────────────────────────────────

/**
 * Persist a tool result to Supabase.
 * Fully awaited — returns the new row ID on success or null on failure.
 * Logs every step so failures are visible in the browser DevTools console.
 */
export async function saveGeneration(
  table: TableName,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {
  console.log(`[saveGeneration] ▶ START  table=${table}`);

  try {
    const supabase = createClient();

    // ── Step 1: confirm authenticated user ────────────────────────────────
    console.log("[saveGeneration] checking auth.getUser()…");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("[saveGeneration] auth.getUser() ERROR:", authError);
      return null;
    }
    if (!user) {
      console.error(
        "[saveGeneration] auth.getUser() returned NULL — user is not authenticated"
      );
      return null;
    }
    console.log(`[saveGeneration] ✓ user confirmed  id=${user.id}  email=${user.email}`);

    // ── Step 2: JSON-safe serialise input & output ────────────────────────
    let safeInput: Record<string, unknown>;
    let safeOutput: Record<string, unknown>;
    try {
      safeInput  = toJsonSafe(input);
      safeOutput = toJsonSafe(output);
    } catch {
      console.error("[saveGeneration] serialization failed — aborting insert");
      return null;
    }
    console.log("[saveGeneration] input  keys:", Object.keys(safeInput));
    console.log("[saveGeneration] output keys:", Object.keys(safeOutput));

    // ── Step 3: INSERT ────────────────────────────────────────────────────
    console.log(`[saveGeneration] inserting into ${table} with user_id=${user.id}…`);
    const { data, error } = await supabase
      .from(table)
      .insert({ user_id: user.id, input: safeInput, output: safeOutput })
      .select("id")
      .single();

    if (error) {
      console.error(`[saveGeneration] ✗ INSERT FAILED  table=${table}`, {
        code:    error.code,
        message: error.message,
        details: error.details,
        hint:    error.hint,
        full:    error,
      });
      return null;
    }

    const id = (data as { id: string }).id;
    console.log(`[saveGeneration] ✓ INSERT OK  id=${id}  table=${table}`);
    return id;

  } catch (err) {
    console.error("[saveGeneration] UNEXPECTED EXCEPTION:", err);
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
    if (!user) {
      console.warn("[fetchHistory] no authenticated user — returning empty list");
      return [];
    }

    const results = await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select("id, input, output, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error(`[fetchHistory] table=${table} ERROR:`, error);
          return [] as HistoryRow[];
        }

        return (data ?? []).map((row) => ({
          ...(row as {
            id: string;
            input: Record<string, unknown>;
            output: Record<string, unknown>;
            created_at: string;
          }),
          table,
        }));
      })
    );

    return results
      .flat()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  } catch (err) {
    console.error("[fetchHistory] UNEXPECTED EXCEPTION:", err);
    return [];
  }
}

// ─── History delete ───────────────────────────────────────────────────────────

export async function deleteHistoryRecord(
  table: TableName,
  id: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`[deleteHistoryRecord] table=${table} id=${id} ERROR:`, error);
    }
    return !error;
  } catch {
    return false;
  }
}

// ─── Profile helpers ──────────────────────────────────────────────────────────

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
      console.error("[updateProfileInDb] ERROR:", error);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
