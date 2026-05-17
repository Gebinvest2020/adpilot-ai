/**
 * lib/supabase/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side database helpers. Imported from "use client" components only.
 *
 * ARCHITECTURE:
 *   saveGeneration receives userId from the calling component (via useUser()).
 *   No auth calls are made here — they deadlock against UserProvider's mutex.
 *
 *   The insert uses a two-path strategy:
 *     1. Supabase JS client (.from().insert()) with an 8s timeout
 *     2. Direct PostgREST fetch() as fallback if the client hangs
 *   This lets us tell whether the problem is in the client or the server.
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

// ─── Generation save ──────────────────────────────────────────────────────────

export async function saveGeneration(
  table: TableName,
  userId: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): Promise<string | null> {

  // ── Step 1: validate userId ────────────────────────────────────────────────
  console.log("GET USER START");
  console.log("GET USER RESULT", { userId, table });

  if (!userId || !userId.trim()) {
    console.error("GET USER ERROR", "userId is empty — user is not authenticated");
    return null;
  }

  // ── Step 2: JSON-safe serialisation ──────────────────────────────────────
  let safeInput: Record<string, unknown>;
  let safeOutput: Record<string, unknown>;
  try {
    safeInput  = JSON.parse(JSON.stringify(input))  as Record<string, unknown>;
    safeOutput = JSON.parse(JSON.stringify(output)) as Record<string, unknown>;
  } catch (e) {
    console.error("GET USER ERROR", "JSON serialization failed:", e);
    return null;
  }

  const payload = { user_id: userId, input: safeInput, output: safeOutput };

  console.log("INSERT START");
  console.log("INSERT PAYLOAD", {
    table,
    user_id:    payload.user_id,
    inputKeys:  Object.keys(safeInput),
    outputKeys: Object.keys(safeOutput),
    payloadBytes: JSON.stringify(payload).length,
  });
  console.log("INSERT QUERY START");

  // ── Step 3a: try Supabase JS client with hard timeout ─────────────────────
  const supabase = createClient();

  const clientInsert = async () => {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select("id")
      .single();
    return { data, error };
  };

  const clientTimeout = new Promise<{ data: null; error: Error }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data:  null,
          error: new Error(`[TIMEOUT] Supabase client insert hung after 8s — table=${table}`),
        }),
      8000
    )
  );

  const clientResult = await Promise.race([clientInsert(), clientTimeout]);
  console.log("INSERT RESULT", clientResult);

  // Success via Supabase client
  if (clientResult.data && !clientResult.error) {
    const id = (clientResult.data as { id: string }).id;
    console.log("INSERT SUCCESS", { table, id });
    return id;
  }

  // Log whatever went wrong
  const isTimeout = clientResult.error?.message?.includes("[TIMEOUT]");
  console.error("INSERT ERROR FULL", {
    isTimeout,
    message: clientResult.error?.message,
    code:    (clientResult.error as unknown as { code?: string })?.code,
    details: (clientResult.error as unknown as { details?: string })?.details,
    hint:    (clientResult.error as unknown as { hint?: string })?.hint,
    full:    clientResult.error,
  });

  // ── Step 3b: fallback — direct PostgREST fetch ────────────────────────────
  // Bypasses the Supabase JS client entirely. If this succeeds while the
  // client hangs, the bug is in the client layer, not the server.
  console.log("INSERT FALLBACK: direct PostgREST fetch starting…");

  try {
    // getSession reads localStorage — safe here because UserProvider's init()
    // is complete before a user can fill in the form and click generate.
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !sessionData?.session?.access_token) {
      console.error("INSERT FALLBACK ERROR: could not get access token", sessErr);
      return null;
    }

    const accessToken = sessionData.session.access_token;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const endpoint    = `${supabaseUrl}/rest/v1/${table}`;

    console.log("INSERT FALLBACK REQUEST", { endpoint, user_id: userId });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "apikey":        supabaseKey,
        "Authorization": `Bearer ${accessToken}`,
        "Prefer":        "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("INSERT FALLBACK RESPONSE", {
      status: response.status,
      ok:     response.ok,
      body:   text.slice(0, 600),
    });

    if (!response.ok) {
      console.error("INSERT FALLBACK ERROR", { status: response.status, body: text });
      return null;
    }

    const rows = JSON.parse(text) as Array<{ id: string }>;
    const id   = rows[0]?.id ?? null;

    if (id) {
      console.log("INSERT SUCCESS (via fallback fetch)", { table, id });
      return id;
    }

    console.error("INSERT FALLBACK ERROR: response OK but no id in body", rows);
    return null;

  } catch (fetchErr) {
    console.error("INSERT FALLBACK EXCEPTION:", fetchErr);
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

    // getSession: reads localStorage, no network call
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
