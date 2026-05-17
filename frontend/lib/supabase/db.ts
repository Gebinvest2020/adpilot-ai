/**
 * lib/supabase/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side database helpers. Imported from "use client" components only.
 *
 * ARCHITECTURE NOTE — why we don't call auth inside saveGeneration:
 *
 *   supabase.auth.getUser()    — validates JWT with the Supabase auth server
 *                                 (network call). Holds an internal auth mutex
 *                                 during the request.
 *   supabase.auth.getSession() — reads local storage. Also goes through the
 *                                 same mutex when a token refresh is in flight.
 *
 *   If UserProvider's init() is mid-refresh when saveGeneration runs, any
 *   auth call inside saveGeneration queues behind the mutex and hangs forever.
 *
 *   FIX: saveGeneration receives userId from the calling component (which
 *   already has the authenticated user from UserProvider context). No auth
 *   calls are made inside this module at all — no mutex, no deadlock.
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

function toJsonSafe(value: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

// ─── Generation save ──────────────────────────────────────────────────────────

/**
 * Persist a tool result to Supabase.
 *
 * @param table     Target table name
 * @param userId    Authenticated user's UUID — passed from component via
 *                  useUser() so no auth call is needed here
 * @param input     Tool input (form values)
 * @param output    Tool result
 * @returns         Inserted row ID on success, null on failure
 */
export async function saveGeneration(
  table: TableName,
  userId: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {

  // ── Validate userId ────────────────────────────────────────────────────────
  console.log("GET USER START");
  console.log("GET USER RESULT", { userId, table });

  if (!userId || userId.trim() === "") {
    console.error("GET USER ERROR", "userId is empty — user is not authenticated");
    return null;
  }

  // ── Serialise payload ─────────────────────────────────────────────────────
  let safeInput: Record<string, unknown>;
  let safeOutput: Record<string, unknown>;

  try {
    safeInput  = toJsonSafe(input);
    safeOutput = toJsonSafe(output);
  } catch (e) {
    console.error("GET USER ERROR", "Payload has non-JSON-safe values:", e);
    return null;
  }

  const payload = {
    user_id: userId,
    input:   safeInput,
    output:  safeOutput,
  };

  // ── Insert ────────────────────────────────────────────────────────────────
  console.log("INSERT START");
  console.log("INSERT PAYLOAD", {
    table,
    user_id:    payload.user_id,
    inputKeys:  Object.keys(safeInput),
    outputKeys: Object.keys(safeOutput),
  });

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR", {
        table,
        code:    error.code,
        message: error.message,
        details: error.details,
        hint:    error.hint,
      });
      return null;
    }

    console.log("INSERT SUCCESS", { table, id: (data as { id: string }).id });
    return (data as { id: string }).id;

  } catch (err) {
    console.error("INSERT ERROR", "Unexpected exception:", err);
    return null;
  }
}

// ─── History fetch ────────────────────────────────────────────────────────────

export async function fetchHistory(
  tables: TableName[] = ["rsa_generations", "moderation_checks", "ctr_analyses"],
  limit = 50
): Promise<HistoryRow[]> {
  try {
    const supabase = createClient();

    // getSession reads localStorage — no network, no mutex
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
