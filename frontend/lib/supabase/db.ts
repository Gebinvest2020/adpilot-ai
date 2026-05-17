/**
 * lib/supabase/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side database helpers for persisting tool results and reading history.
 * Imported from "use client" components only.
 *
 * AUTH NOTE:
 *   getUser()    → validates JWT with Supabase auth server (network request).
 *                  Can hang if the auth endpoint is slow / unreachable.
 *   getSession() → reads the cached session from localStorage (no network).
 *                  Safe for client-side inserts because the JWT is already
 *                  trusted (it was issued by the same Supabase project).
 *
 *   We use getSession() here so saves are instant and never block on auth I/O.
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
 * Drops undefined values, converts Dates to ISO strings, throws on
 * circular references (which would make Supabase reject the JSONB payload).
 */
function toJsonSafe(value: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

// ─── Generation save ──────────────────────────────────────────────────────────

export async function saveGeneration(
  table: TableName,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {
  console.log(`[saveGeneration] ▶ START  table=${table}`);

  try {
    const supabase = createClient();

    // ── Step 1: get session from localStorage (no network call) ────────────
    console.log("[saveGeneration] calling getSession()…");
    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("[saveGeneration] getSession result:", {
      session:  sessionData?.session ? "present" : "null",
      userId:   sessionData?.session?.user?.id ?? null,
      email:    sessionData?.session?.user?.email ?? null,
      error:    sessionError,
    });

    if (sessionError) {
      console.error("[saveGeneration] getSession ERROR:", sessionError);
      return null;
    }

    const user = sessionData?.session?.user ?? null;

    if (!user) {
      console.error(
        "[saveGeneration] No active session — user is not logged in.\n" +
        "Please log out and log back in, then try again."
      );

      // ── Step 1b: fallback attempt with getUser() ───────────────────────
      console.log("[saveGeneration] fallback: trying getUser()…");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("[saveGeneration] getUser result:", {
        user:  userData?.user?.id ?? null,
        error: userError,
      });

      if (!userData?.user) {
        console.error("[saveGeneration] Both getSession and getUser returned null. Aborting.");
        return null;
      }

      // Proceed with getUser result
      return await doInsert(supabase, table, userData.user.id, input, output);
    }

    return await doInsert(supabase, table, user.id, input, output);

  } catch (err) {
    console.error("[saveGeneration] UNEXPECTED EXCEPTION:", err);
    return null;
  }
}

async function doInsert(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: TableName,
  userId: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {
  // ── Step 2: JSON-safe serialisation ─────────────────────────────────────
  let safeInput: Record<string, unknown>;
  let safeOutput: Record<string, unknown>;
  try {
    safeInput  = toJsonSafe(input);
    safeOutput = toJsonSafe(output);
  } catch (e) {
    console.error("[saveGeneration] Serialization failed — object has non-JSON-safe values:", e);
    return null;
  }

  // ── Step 3: log exact payload ────────────────────────────────────────────
  const payload = { user_id: userId, input: safeInput, output: safeOutput };
  console.log("[saveGeneration] Insert payload:", {
    table,
    user_id:      payload.user_id,
    inputKeys:    Object.keys(safeInput),
    outputKeys:   Object.keys(safeOutput),
  });

  // ── Step 4: INSERT ────────────────────────────────────────────────────────
  console.log(`[saveGeneration] Executing INSERT into ${table}…`);
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(`[saveGeneration] Insert error (table=${table}):`, {
      code:    error.code,
      message: error.message,
      details: error.details,
      hint:    error.hint,
    });
    return null;
  }

  console.log(`[saveGeneration] Insert success (table=${table}):`, data);
  return (data as { id: string }).id;
}

// ─── History fetch ────────────────────────────────────────────────────────────

export async function fetchHistory(
  tables: TableName[] = ["rsa_generations", "moderation_checks", "ctr_analyses"],
  limit = 50
): Promise<HistoryRow[]> {
  try {
    const supabase = createClient();

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user ?? null;

    if (!user) {
      console.warn("[fetchHistory] no active session — returning empty list");
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
