/**
 * POST /api/ai/ctr-analyze
 *
 * Server-side CTR analysis via OpenAI.
 * Returns CTRAnalysisResult JSON on success, or { error: string } on failure
 * so the client can fall back to the rule-based analyzer.
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { CTRAnalysisResult, CTRBreakdownItem, CTRBreakdownKey } from "@/lib/mock-data";

// ─── Prompts ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a certified Google Ads specialist and senior PPC conversion-rate optimizer.

Analyze ad copy for Click-Through Rate (CTR) potential across 5 dimensions (0–100 each):
1. headlineStrength — power words, specificity, numbers, emotional triggers
2. callToAction — presence, clarity and urgency of CTA phrases
3. keywordRelevance — match between ad copy and provided keywords / user search intent
4. emotionalAppeal — pain points addressed, desire triggered, empathy shown
5. uniqueness — differentiation from generic copy, specific benefits

OVERALL SCORE = weighted average: headlineStrength×25 + callToAction×20 + keywordRelevance×25 + emotionalAppeal×15 + uniqueness×15, divided by 100.

Status values: "excellent" (≥80), "good" (65–79), "average" (45–64), "needs-work" (<45).

Provide 3–7 specific, actionable recommendations for improving CTR.
Provide 3 improved headline examples (≤30 chars each) and 1 improved description (≤90 chars).

RESPOND ONLY WITH VALID JSON — no markdown fences.`;

function buildUserPrompt(
  adCopy: string,
  keywords: string,
  industry: string,
  language: string
): string {
  const lang = language === "Russian" ? "Russian (Русский)" : "English";
  const now  = language === "Russian" ? "Только что · AI" : "Just now · AI";

  return `Ad copy to analyze:
"""
${adCopy.slice(0, 2000)}
"""

Target keywords: ${keywords || "not provided"}
Industry: ${industry || "General"}
Output language: ${lang}
Write ALL text (recommendations, improvedHeadlines, improvedDescription) in ${lang}.

Return ONLY this JSON:

{
  "overallScore": 72,
  "breakdown": [
    {"key": "headlineStrength", "score": 75, "status": "good"},
    {"key": "callToAction",     "score": 45, "status": "needs-work"},
    {"key": "keywordRelevance", "score": 85, "status": "excellent"},
    {"key": "emotionalAppeal",  "score": 60, "status": "average"},
    {"key": "uniqueness",       "score": 65, "status": "good"}
  ],
  "recommendations": [
    "Specific recommendation 1 in ${lang}",
    "Specific recommendation 2 in ${lang}",
    "Specific recommendation 3 in ${lang}"
  ],
  "improvedHeadlines": [
    "Headline ≤30 chars",
    "Headline ≤30 chars",
    "Headline ≤30 chars"
  ],
  "improvedDescription": "Improved description ≤90 chars in ${lang}",
  "checkedAt": "${now}"
}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const VALID_KEYS: CTRBreakdownKey[] = [
  "headlineStrength", "callToAction", "keywordRelevance", "emotionalAppeal", "uniqueness",
];

const VALID_STATUSES = ["excellent", "good", "average", "needs-work"] as const;

function clampStr(s: unknown, max: number): string {
  if (typeof s !== "string" || !s.trim()) return "";
  return s.trim().slice(0, max);
}

function sanitiseResult(raw: unknown, language: string): CTRAnalysisResult {
  const now = language === "Russian" ? "Только что · AI" : "Just now · AI";
  if (typeof raw !== "object" || raw === null) throw new Error("Non-object response");

  const obj = raw as Record<string, unknown>;

  // ── Breakdown ──────────────────────────────────────────────────────────────
  const rawBreakdown = Array.isArray(obj.breakdown) ? obj.breakdown : [];
  const breakdown: CTRBreakdownItem[] = VALID_KEYS.map(key => {
    const item = rawBreakdown.find(
      (b): b is Record<string, unknown> =>
        typeof b === "object" && b !== null &&
        (b as Record<string, unknown>).key === key
    );
    const score = typeof item?.score === "number"
      ? Math.min(100, Math.max(0, Math.round(item.score)))
      : 50;
    const status = VALID_STATUSES.includes(item?.status as typeof VALID_STATUSES[number])
      ? (item!.status as CTRBreakdownItem["status"])
      : (score >= 80 ? "excellent" : score >= 65 ? "good" : score >= 45 ? "average" : "needs-work");
    return { key, score, status };
  });

  // ── Overall score ──────────────────────────────────────────────────────────
  const overallScore = typeof obj.overallScore === "number"
    ? Math.min(100, Math.max(0, Math.round(obj.overallScore)))
    : Math.round(breakdown.reduce((s, b) => s + b.score, 0) / breakdown.length);

  // ── Recommendations ────────────────────────────────────────────────────────
  const rawRecs = Array.isArray(obj.recommendations) ? obj.recommendations : [];
  const recommendations: string[] = rawRecs
    .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    .map(r => r.trim().slice(0, 400))
    .slice(0, 7);
  if (recommendations.length === 0) throw new Error("No recommendations");

  // ── Improved content ───────────────────────────────────────────────────────
  const rawHL = Array.isArray(obj.improvedHeadlines) ? obj.improvedHeadlines : [];
  const improvedHeadlines = rawHL
    .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
    .map(h => h.trim().slice(0, 30))
    .slice(0, 3);

  const improvedDescription = clampStr(obj.improvedDescription, 90);

  return {
    overallScore,
    breakdown,
    recommendations,
    improvedHeadlines: improvedHeadlines.length > 0 ? improvedHeadlines : ["Improved headline"],
    improvedDescription: improvedDescription || "Improved ad copy",
    checkedAt: clampStr(obj.checkedAt, 60) || now,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // ── API key check ─────────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const maskedKey = apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : "(not set)";
  console.log(`[ctr-analyze] API key: ${maskedKey}`);

  if (!apiKey) {
    console.warn("[ctr-analyze] ⚠️  No OPENAI_API_KEY — returning 503 (client will fall back)");
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
  const keywords = typeof body.keywords  === "string" ? body.keywords.trim()  : "";
  const industry = typeof body.industry  === "string" ? body.industry.trim()  : "";
  const language = typeof body.language  === "string" ? body.language.trim()  : "English";

  if (adCopy.length < 5) {
    return NextResponse.json({ error: "ad_copy_too_short" }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const client = new OpenAI({ apiKey });
    console.log(`[ctr-analyze] 🚀 Calling OpenAI model="${model}" adCopy length=${adCopy.length}`);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(adCopy, keywords, industry, language) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.45,
      max_completion_tokens: 1400,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");

    const parsed: unknown = JSON.parse(content);
    const result = sanitiseResult(parsed, language);

    const usage = completion.usage;
    console.log(`[ctr-analyze] ✅ OpenAI success — ${usage?.total_tokens ?? "?"} tokens, overall=${result.overallScore}`);

    return NextResponse.json({ ...result, aiMode: "openai" });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ctr-analyze] ❌ OpenAI error:", message);

    if (isDev) {
      return NextResponse.json(
        { error: "ai_failed", message, hint: "Check OPENAI_API_KEY in .env.local and OPENAI_MODEL value" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "ai_failed", message }, { status: 503 });
  }
}
