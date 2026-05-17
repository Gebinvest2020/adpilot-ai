/**
 * POST /api/ai/moderation-check
 *
 * Server-side Google Ads policy analysis via OpenAI.
 * Returns ModerationCheckResult JSON on success, or { error: string } on failure
 * so the client can fall back to the rule-based checker.
 *
 * The API key is read from process.env.OPENAI_API_KEY and is NEVER
 * exposed to the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type {
  ModerationCheckResult,
  ModerationPolicyFlag,
  ModerationCategory,
} from "@/lib/mock-data";

// ─── Prompt templates ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a certified Google Ads policy compliance expert and senior PPC specialist.

Your task: analyze ad copy for Google Ads policy violations across 8 risk categories.

RISK CATEGORIES:
1. "misleading" — false/unverified claims, fake #1 rankings, fabricated urgency
2. "unrealistic" — extreme ROI (300%+), x10 returns, "triple your money"
3. "financial" — guaranteed returns, risk-free investments, yield/APY promises
4. "crypto" — crypto profit promises, bitcoin earnings, unregulated exchange promotion
5. "healthcare" — disease cure claims, guaranteed weight loss, supplement miracle claims
6. "sensational" — shocking language, ALL CAPS abuse, "incredible results"
7. "employment" — specific income promises ("earn $500/day"), work-from-home income guarantees
8. "other" — other policy violations

SAFETY SCORE (overallScore: 0–100, higher = safer):
- Deduct 18 for each HIGH severity flag
- Deduct 9 for each MEDIUM severity flag
- Deduct 4 for each LOW severity flag
- Clamp between 5 and 95

RISK LEVEL:
- "LOW" if overallScore >= 75
- "MEDIUM" if overallScore >= 45
- "HIGH" if overallScore < 45

SAFE ITEMS: List up to 5 positive compliance signals found in the ad copy (soft CTAs, educational framing, consultation offers, geo-targeting, no pressure tactics).

RESPOND ONLY WITH VALID JSON — no markdown fences, no extra text.`;

function buildUserPrompt(
  adCopy: string,
  industry: string,
  language: string
): string {
  const lang = language === "Russian" ? "Russian (Русский)" : "English";
  const now = language === "Russian" ? "Только что · AI" : "Just now · AI";

  return `Ad copy to analyze:
"""
${adCopy.slice(0, 3000)}
"""

Industry context: ${industry || "General"}
Response language: ${lang}
(Write ALL text fields — summary, explanation, saferVersion — in ${lang})

Return ONLY this JSON structure:

{
  "overallScore": 85,
  "riskLevel": "LOW",
  "summary": "One paragraph assessment of the ad copy compliance...",
  "flags": [
    {
      "id": "f1",
      "category": "financial",
      "severity": "high",
      "triggerText": "the exact phrase from ad copy that triggered this flag",
      "explanation": "Why this violates Google Ads policy...",
      "saferVersion": "Safer alternative wording suggestion..."
    }
  ],
  "safeItems": [
    "Positive compliance signal 1",
    "Positive compliance signal 2"
  ],
  "analysisNote": "Optional 1-2 sentence strategy note for improving compliance (same language as ad copy)",
  "checkedAt": "${now}"
}

If no violations found, return flags: [] and a clean summary.
REMINDER: all text in ${lang}.`;
}

// ─── Validation / sanitisation ────────────────────────────────────────────────

function clampStr(s: unknown, max: number): string {
  if (typeof s !== "string" || !s.trim()) return "";
  return s.trim().slice(0, max);
}

function toCategory(v: unknown): ModerationCategory {
  const valid: ModerationCategory[] = [
    "misleading", "unrealistic", "financial", "crypto",
    "healthcare", "sensational", "employment", "other",
  ];
  if (typeof v === "string" && (valid as string[]).includes(v)) {
    return v as ModerationCategory;
  }
  return "other";
}

function toSeverity(v: unknown): ModerationPolicyFlag["severity"] {
  if (v === "low" || v === "medium" || v === "high") return v;
  return "low";
}

function toRiskLevel(v: unknown): "LOW" | "MEDIUM" | "HIGH" {
  if (v === "LOW" || v === "MEDIUM" || v === "HIGH") return v;
  return "LOW";
}

function sanitiseResult(raw: unknown, language: string): ModerationCheckResult {
  const now = language === "Russian" ? "Только что · AI" : "Just now · AI";

  if (typeof raw !== "object" || raw === null) {
    throw new Error("Non-object response");
  }

  const obj = raw as Record<string, unknown>;

  // ── Flags ──────────────────────────────────────────────────────────────────
  const rawFlags = Array.isArray(obj.flags) ? obj.flags : [];
  const flags: ModerationPolicyFlag[] = rawFlags
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
    .map((f, i) => {
      const triggerText = clampStr(f.triggerText, 200);
      const explanation = clampStr(f.explanation, 400);
      if (!triggerText || !explanation) return null;
      return {
        id: `f${i + 1}`,
        category: toCategory(f.category),
        severity: toSeverity(f.severity),
        triggerText,
        explanation,
        saferVersion: clampStr(f.saferVersion, 300) || "—",
      };
    })
    .filter((f): f is ModerationPolicyFlag => f !== null)
    .slice(0, 12);

  // ── Safe items ─────────────────────────────────────────────────────────────
  const rawSafe = Array.isArray(obj.safeItems) ? obj.safeItems : [];
  const safeItems: string[] = rawSafe
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .map(s => s.trim().slice(0, 150))
    .slice(0, 6);

  // ── Score / risk ───────────────────────────────────────────────────────────
  const overallScore = typeof obj.overallScore === "number"
    ? Math.min(95, Math.max(5, Math.round(obj.overallScore)))
    : 75;

  const riskLevel = toRiskLevel(obj.riskLevel);

  const summary = clampStr(obj.summary, 500);
  if (!summary) throw new Error("No summary in response");

  const analysisNote = typeof obj.analysisNote === "string"
    ? obj.analysisNote.trim().slice(0, 400)
    : undefined;

  return {
    overallScore,
    riskLevel,
    summary,
    flags,
    safeItems,
    ...(analysisNote ? { analysisNote } : {}),
    checkedAt: clampStr(obj.checkedAt, 60) || now,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // ── API key check ─────────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const maskedKey = apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : "(not set)";
  console.log(`[moderation-check] API key: ${maskedKey}`);

  if (!apiKey) {
    console.warn("[moderation-check] ⚠️  No OPENAI_API_KEY — returning 503 (client will fall back)");
    return NextResponse.json(
      { error: "no_key", message: "OPENAI_API_KEY not configured — add it to .env.local" },
      { status: 503 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const adCopy   = typeof body.adCopy    === "string" ? body.adCopy.trim()    : "";
  const industry = typeof body.industry  === "string" ? body.industry.trim()  : "";
  const language = typeof body.language  === "string" ? body.language.trim()  : "English";

  if (adCopy.length < 5) {
    return NextResponse.json({ error: "ad_copy_too_short" }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const client = new OpenAI({ apiKey });
    console.log(`[moderation-check] 🚀 Calling OpenAI model="${model}" adCopy length=${adCopy.length}`);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(adCopy, industry, language) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_completion_tokens: 1800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");

    const parsed: unknown = JSON.parse(content);
    const result = sanitiseResult(parsed, language);

    const usage = completion.usage;
    console.log(`[moderation-check] ✅ OpenAI success — ${usage?.total_tokens ?? "?"} tokens, ${result.flags.length} flags, score=${result.overallScore}`);

    return NextResponse.json({ ...result, aiMode: "openai" });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[moderation-check] ❌ OpenAI error:", message);

    if (isDev) {
      return NextResponse.json(
        { error: "ai_failed", message, hint: "Check OPENAI_API_KEY in .env.local and OPENAI_MODEL value" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "ai_failed", message }, { status: 503 });
  }
}
