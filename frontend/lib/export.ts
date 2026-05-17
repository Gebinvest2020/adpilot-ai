// ─── Export utilities (no external libraries) ───────────────────────────────
// All exports use browser APIs only: Blob + URL.createObjectURL + <a> click.

/** Trigger a file download in the browser. */
function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Escape a cell value for CSV. */
function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

// ─────────────────────────────── RSA EXPORTS ─────────────────────────────────

export interface RSAExportData {
  niche: string;
  country: string;
  language: string;
  headlines: { text: string; strength: string }[];
  descriptions: { text: string; strength: string }[];
  ctaSuggestions: string[];
  moderation: { score: number; level: string };
  generatedAt: string;
}

export function exportRSATxt(data: RSAExportData): void {
  const lines = [
    "=== AdPilot AI — RSA Generation Export ===",
    `Generated: ${data.generatedAt}`,
    `Niche: ${data.niche}`,
    `Country: ${data.country}  |  Language: ${data.language}`,
    "",
    "=== HEADLINES (max 30 chars each) ===",
    ...data.headlines.map((h, i) => `${String(i + 1).padStart(2, "0")}. [${h.strength.toUpperCase()}] ${h.text}`),
    "",
    "=== DESCRIPTIONS (max 90 chars each) ===",
    ...data.descriptions.map((d, i) => `${String(i + 1).padStart(2, "0")}. [${d.strength.toUpperCase()}] ${d.text}`),
    "",
    "=== CTA SUGGESTIONS ===",
    ...data.ctaSuggestions.map((c, i) => `${i + 1}. ${c}`),
    "",
    `=== MODERATION SCORE: ${data.moderation.score}/100 (${data.moderation.level}) ===`,
    "",
    "Generated with AdPilot AI — https://adpilot.ai",
  ];
  download(`adpilot-rsa-${Date.now()}.txt`, lines.join("\n"), "text/plain;charset=utf-8");
}

export function exportRSACsv(data: RSAExportData): void {
  const rows: string[] = [
    ["Type", "Index", "Text", "Strength", "Char Count"].map(csvCell).join(","),
    ...data.headlines.map((h, i) =>
      [csvCell("Headline"), csvCell(String(i + 1)), csvCell(h.text), csvCell(h.strength), csvCell(String(h.text.length))].join(",")
    ),
    ...data.descriptions.map((d, i) =>
      [csvCell("Description"), csvCell(String(i + 1)), csvCell(d.text), csvCell(d.strength), csvCell(String(d.text.length))].join(",")
    ),
    ...data.ctaSuggestions.map((c, i) =>
      [csvCell("CTA"), csvCell(String(i + 1)), csvCell(c), csvCell(""), csvCell(String(c.length))].join(",")
    ),
  ];
  download(`adpilot-rsa-${Date.now()}.csv`, rows.join("\n"), "text/csv;charset=utf-8");
}

export function exportRSAJson(data: RSAExportData): void {
  download(
    `adpilot-rsa-${Date.now()}.json`,
    JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2),
    "application/json"
  );
}

// ─────────────────────────────── CTR EXPORTS ─────────────────────────────────

export interface CTRExportData {
  adText: string;
  keywords: string;
  industry: string;
  overallScore: number;
  breakdown: { key: string; score: number; status: string }[];
  recommendations: string[];
  improvedHeadlines: string[];
  improvedDescription?: string;
  checkedAt: string;
}

export function exportCTRTxt(data: CTRExportData): void {
  const lines = [
    "=== AdPilot AI — CTR Analysis Export ===",
    `Analyzed: ${data.checkedAt}`,
    `Industry: ${data.industry || "General"}`,
    `Overall CTR Score: ${data.overallScore}/100`,
    "",
    "=== ORIGINAL AD COPY ===",
    data.adText,
    "",
    "=== SCORE BREAKDOWN ===",
    ...data.breakdown.map((b) => `${b.key.padEnd(20)} ${b.score}/100  [${b.status}]`),
    "",
    "=== AI RECOMMENDATIONS ===",
    ...data.recommendations.map((r, i) => `${i + 1}. ${r}`),
    "",
    "=== IMPROVED HEADLINES ===",
    ...data.improvedHeadlines.map((h, i) => `${i + 1}. ${h}`),
    "",
    ...(data.improvedDescription ? ["=== IMPROVED DESCRIPTION ===", data.improvedDescription, ""] : []),
    "Generated with AdPilot AI — https://adpilot.ai",
  ];
  download(`adpilot-ctr-${Date.now()}.txt`, lines.join("\n"), "text/plain;charset=utf-8");
}

export function exportCTRJson(data: CTRExportData): void {
  download(
    `adpilot-ctr-${Date.now()}.json`,
    JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2),
    "application/json"
  );
}

// ────────────────────────── MODERATION EXPORTS ───────────────────────────────

export interface ModerationExportData {
  adText: string;
  score: number;
  level: string;
  flags: { field: string; issue: string; severity: string; safer: string }[];
  categories: { name: string; passed: boolean; note?: string }[];
  checkedAt: string;
}

export function exportModerationTxt(data: ModerationExportData): void {
  const lines = [
    "=== AdPilot AI — Moderation Report ===",
    `Checked: ${data.checkedAt}`,
    `Safety Score: ${data.score}/100  |  Risk Level: ${data.level}`,
    "",
    "=== ORIGINAL AD COPY ===",
    data.adText,
    "",
    "=== POLICY FLAGS ===",
    data.flags.length === 0
      ? "No policy violations detected."
      : data.flags.map((f, i) =>
          [
            `${i + 1}. [${f.severity.toUpperCase()}] "${f.field}"`,
            `   Issue: ${f.issue}`,
            `   Safer alternative: "${f.safer}"`,
          ].join("\n")
        ).join("\n\n"),
    "",
    "=== CATEGORY CHECKS ===",
    ...data.categories.map((c) => `${c.passed ? "✓" : "✗"}  ${c.name}${c.note ? ` — ${c.note}` : ""}`),
    "",
    "Generated with AdPilot AI — https://adpilot.ai",
  ];
  download(`adpilot-moderation-${Date.now()}.txt`, lines.join("\n"), "text/plain;charset=utf-8");
}

export function exportModerationJson(data: ModerationExportData): void {
  download(
    `adpilot-moderation-${Date.now()}.json`,
    JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2),
    "application/json"
  );
}

export function exportModerationCsv(data: ModerationExportData): void {
  const rows = [
    ["Field", "Issue", "Severity", "Safer Alternative"].map(csvCell).join(","),
    ...data.flags.map((f) =>
      [csvCell(f.field), csvCell(f.issue), csvCell(f.severity), csvCell(f.safer)].join(",")
    ),
  ];
  download(`adpilot-moderation-${Date.now()}.csv`, rows.join("\n"), "text/csv;charset=utf-8");
}
