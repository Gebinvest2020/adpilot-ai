/**
 * POST /api/ai/rsa-generate
 *
 * Server-side RSA generation via OpenAI.
 * Returns RSAFullResult JSON on success, or { error: string } on failure
 * so the client can fall back to the rule-based generator.
 *
 * The API key is read from process.env.OPENAI_API_KEY and is NEVER
 * exposed to the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { RSAFullResult, RSAHeadline, RSADescription, ModerationFlag } from "@/lib/mock-data";

// ─── Prompt templates ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a certified Google Ads RSA (Responsive Search Ads) specialist and senior PPC copywriter.

CRITICAL RULES — follow exactly:
1. Headlines: MAXIMUM 30 characters each (count every space and punctuation)
2. Descriptions: MAXIMUM 90 characters each
3. Write ALL copy in the language specified by the user (Russian or English)
4. Generate exactly 15 headlines and exactly 4 descriptions
5. Each headline must serve a DIFFERENT purpose: geo-targeting, benefit, feature, CTA, audience, urgency, etc.
6. Never repeat the same idea twice across headlines
7. Be highly specific to the business niche — no generic ad copy

GOOGLE ADS POLICY COMPLIANCE:
- Finance / crypto: NO income guarantees, NO "risk-free", NO profit promises, NO APY/yield claims
- Medical / health: NO cure claims, NO treatment guarantees, NO "100% effective"
- Legal: NO case outcome promises, NO "guaranteed win"
- Real estate: NO inflated ROI or yield claims
- Employment: NO fake income figures, NO "earn $X/day"

STRENGTH SCORING GUIDE:
- "excellent" (strengthScore 88–100): highly niche-specific, keyword-rich, strong CTA or geo signal
- "good" (strengthScore 70–87): relevant and clear, good CTR potential
- "average" (strengthScore 50–69): acceptable but somewhat generic
- "weak" (strengthScore < 50): too generic, should be improved

TIPS: Each headline/description tip must explain WHY this ad copy works (1 sentence, same language as ad copy).

RESPOND ONLY WITH VALID JSON — no markdown fences, no extra text.`;

function buildUserPrompt(
  niche: string,
  countryCode: string,
  language: string,
  goal: string,
  tone: string
): string {
  const lang = language === "Russian" ? "Russian (Русский)" : "English";
  const now = language === "Russian" ? "Только что · AI" : "Just now · AI";

  return `Business / niche: ${niche}
Target country code: ${countryCode}
Ad language: ${lang}
Campaign goal: ${goal || "Generate leads"}
Ad tone: ${tone || "Professional"}

Generate RSA ad copy for this business. Return ONLY this JSON (no markdown):

{
  "headlines": [
    {"id":"h1","text":"...","strength":"excellent","strengthScore":95,"tip":"..."},
    {"id":"h2","text":"...","strength":"excellent","strengthScore":93,"tip":"..."},
    {"id":"h3","text":"...","strength":"excellent","strengthScore":92,"tip":"..."},
    {"id":"h4","text":"...","strength":"excellent","strengthScore":91,"tip":"..."},
    {"id":"h5","text":"...","strength":"good","strengthScore":88,"tip":"..."},
    {"id":"h6","text":"...","strength":"good","strengthScore":86,"tip":"..."},
    {"id":"h7","text":"...","strength":"good","strengthScore":84,"tip":"..."},
    {"id":"h8","text":"...","strength":"good","strengthScore":82,"tip":"..."},
    {"id":"h9","text":"...","strength":"good","strengthScore":80,"tip":"..."},
    {"id":"h10","text":"...","strength":"good","strengthScore":78,"tip":"..."},
    {"id":"h11","text":"...","strength":"average","strengthScore":74,"tip":"..."},
    {"id":"h12","text":"...","strength":"average","strengthScore":72,"tip":"..."},
    {"id":"h13","text":"...","strength":"average","strengthScore":70,"tip":"..."},
    {"id":"h14","text":"...","strength":"average","strengthScore":68,"tip":"..."},
    {"id":"h15","text":"...","strength":"average","strengthScore":66,"tip":"..."}
  ],
  "descriptions": [
    {"id":"d1","text":"...","strength":"excellent","strengthScore":93,"tip":"..."},
    {"id":"d2","text":"...","strength":"excellent","strengthScore":90,"tip":"..."},
    {"id":"d3","text":"...","strength":"good","strengthScore":86,"tip":"..."},
    {"id":"d4","text":"...","strength":"good","strengthScore":83,"tip":"..."}
  ],
  "ctaSuggestions": ["CTA 1","CTA 2","CTA 3","CTA 4","CTA 5","CTA 6","CTA 7","CTA 8","CTA 9","CTA 10"],
  "moderation": {
    "score": 90,
    "level": "LOW",
    "flags": []
  },
  "generatedAt": "${now}",
  "strategyNote": "2–3 sentence explanation of the strategy used (same language as ad copy)"
}

REMINDER: headlines ≤30 chars, descriptions ≤90 chars, all text in ${lang}.`;
}

// ─── Validation / sanitisation ────────────────────────────────────────────────

function clampStr(s: unknown, max: number): string {
  if (typeof s !== "string" || !s.trim()) return "";
  return s.trim().slice(0, max);
}

function toStrength(v: unknown): RSAHeadline["strength"] {
  if (v === "excellent" || v === "good" || v === "average" || v === "weak") return v;
  return "average";
}

function toSeverity(v: unknown): ModerationFlag["severity"] {
  if (v === "low" || v === "medium" || v === "high") return v;
  return "low";
}

function toLevel(v: unknown): "LOW" | "MEDIUM" | "HIGH" {
  if (v === "LOW" || v === "MEDIUM" || v === "HIGH") return v;
  return "LOW";
}

function sanitiseResult(raw: unknown, language: string): RSAFullResult {
  const now = language === "Russian" ? "Только что · AI" : "Just now · AI";

  if (typeof raw !== "object" || raw === null) {
    throw new Error("Non-object response");
  }

  const obj = raw as Record<string, unknown>;

  // ── Headlines ──────────────────────────────────────────────────────────────
  const rawHeadlines = Array.isArray(obj.headlines) ? obj.headlines : [];
  const headlines: RSAHeadline[] = rawHeadlines
    .filter((h): h is Record<string, unknown> => typeof h === "object" && h !== null)
    .map((h, i) => {
      const text = clampStr(h.text, 30);
      if (!text) return null;
      return {
        id: `h${i + 1}`,
        text,
        strength: toStrength(h.strength),
        strengthScore: typeof h.strengthScore === "number"
          ? Math.min(100, Math.max(0, Math.round(h.strengthScore)))
          : 70,
        tip: clampStr(h.tip, 200) || "—",
      };
    })
    .filter((h): h is RSAHeadline => h !== null)
    .slice(0, 15);

  if (headlines.length === 0) throw new Error("No valid headlines");

  // ── Descriptions ───────────────────────────────────────────────────────────
  const rawDescs = Array.isArray(obj.descriptions) ? obj.descriptions : [];
  const descriptions: RSADescription[] = rawDescs
    .filter((d): d is Record<string, unknown> => typeof d === "object" && d !== null)
    .map((d, i) => {
      const text = clampStr(d.text, 90);
      if (!text) return null;
      return {
        id: `d${i + 1}`,
        text,
        strength: toStrength(d.strength),
        strengthScore: typeof d.strengthScore === "number"
          ? Math.min(100, Math.max(0, Math.round(d.strengthScore)))
          : 80,
        tip: clampStr(d.tip, 200) || "—",
      };
    })
    .filter((d): d is RSADescription => d !== null)
    .slice(0, 4);

  if (descriptions.length === 0) throw new Error("No valid descriptions");

  // ── CTAs ───────────────────────────────────────────────────────────────────
  const rawCtas = Array.isArray(obj.ctaSuggestions) ? obj.ctaSuggestions : [];
  const ctaSuggestions: string[] = rawCtas
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .map(c => c.trim())
    .slice(0, 10);

  // ── Moderation ─────────────────────────────────────────────────────────────
  const rawMod = (typeof obj.moderation === "object" && obj.moderation !== null)
    ? obj.moderation as Record<string, unknown>
    : {};

  const rawFlags = Array.isArray(rawMod.flags) ? rawMod.flags : [];
  const flags: ModerationFlag[] = rawFlags
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f !== null)
    .map(f => ({
      field: clampStr(f.field, 100) || "—",
      issue: clampStr(f.issue, 300) || "—",
      severity: toSeverity(f.severity),
      safer: clampStr(f.safer, 200) || "—",
    }));

  const score = typeof rawMod.score === "number"
    ? Math.min(100, Math.max(0, Math.round(rawMod.score)))
    : 90;

  // ── Strategy note ──────────────────────────────────────────────────────────
  const strategyNote = typeof obj.strategyNote === "string"
    ? obj.strategyNote.trim().slice(0, 500)
    : undefined;

  return {
    headlines,
    descriptions,
    ctaSuggestions: ctaSuggestions.length > 0 ? ctaSuggestions : ["Learn More"],
    moderation: { score, level: toLevel(rawMod.level), flags },
    generatedAt: clampStr(obj.generatedAt, 60) || now,
    ...(strategyNote ? { strategyNote } : {}),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // ── API key check ─────────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const maskedKey = apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : "(not set)";
  console.log(`[rsa-generate] API key: ${maskedKey}`);

  if (!apiKey) {
    console.warn("[rsa-generate] ⚠️  No OPENAI_API_KEY — returning 503 (client will fall back)");
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

  const niche       = typeof body.niche       === "string" ? body.niche.trim()       : "";
  const countryCode = typeof body.countryCode === "string" ? body.countryCode.trim() : "";
  const language    = typeof body.language    === "string" ? body.language.trim()    : "English";
  const goal        = typeof body.goal        === "string" ? body.goal.trim()        : "";
  const tone        = typeof body.tone        === "string" ? body.tone.trim()        : "";

  if (niche.length < 3) {
    return NextResponse.json({ error: "niche_too_short" }, { status: 400 });
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const client = new OpenAI({ apiKey });
    console.log(`[rsa-generate] 🚀 Calling OpenAI model="${model}" niche="${niche.slice(0, 40)}" lang="${language}"`);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(niche, countryCode, language, goal, tone) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.72,
      max_completion_tokens: 2400,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");

    const parsed: unknown = JSON.parse(content);
    const result = sanitiseResult(parsed, language);

    const usage = completion.usage;
    console.log(`[rsa-generate] ✅ OpenAI success — ${usage?.total_tokens ?? "?"} tokens, ${result.headlines.length} headlines`);

    return NextResponse.json({ ...result, aiMode: "openai" });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[rsa-generate] ❌ OpenAI error:", message);

    if (isDev) {
      return NextResponse.json(
        { error: "ai_failed", message, hint: "Check OPENAI_API_KEY in .env.local and OPENAI_MODEL value" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "ai_failed", message }, { status: 503 });
  }
}
