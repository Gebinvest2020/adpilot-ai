/**
 * Rule-based CTR analysis engine.
 * Used as fallback when OpenAI API is unavailable.
 */

import type { CTRAnalysisResult, CTRBreakdownItem, CTRBreakdownKey } from "@/lib/mock-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.filter(p => p.test(text)).length;
}

function toStatus(score: number): CTRBreakdownItem["status"] {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "average";
  return "needs-work";
}

// ─── Dimension scorers ────────────────────────────────────────────────────────

function scoreHeadlineStrength(text: string): number {
  let score = 40;
  if (/\d/.test(text)) score += 15;
  score += 8 * countMatches(text, [
    /бесплатн|free|скидк|sale|discount/i,
    /быстр|fast|instant|сейчас|now|today|сегодня/i,
    /эксклюзив|exclusive|только|only|limited/i,
    /лучш|top|лидер/i,
    /новинк|new|latest|обновлен/i,
  ]);
  if (/\?/.test(text)) score += 8;
  const lines = text.split("\n").filter(l => l.trim());
  const avgLen = lines.reduce((s, l) => s + l.trim().length, 0) / (lines.length || 1);
  if (avgLen >= 15 && avgLen <= 28) score += 10;
  if (avgLen < 8) score -= 15;
  return clamp(score);
}

function scoreCallToAction(text: string): number {
  let score = 30;
  const strongCTAs = [
    /купить|buy|заказать|order/i,
    /получить|get|claim/i,
    /начать|start|запустить|launch/i,
    /попробовать|try|тестировать/i,
    /узнать|learn|discover/i,
    /зарегистрироваться|sign\s?up|register/i,
    /записаться|book|забронировать/i,
    /скачать|download/i,
    /рассчитать|calculate/i,
    /оставить\s+заявку|submit|запросить|request/i,
  ];
  score += clamp(countMatches(text, strongCTAs) * 20, 0, 55);
  if (/сегодня|today|сейчас|now|срочно|urgent/i.test(text)) score += 10;
  return clamp(score);
}

function scoreKeywordRelevance(text: string, keywords: string): number {
  if (!keywords.trim()) return 55;
  const kws = keywords
    .split(/[,;|\n]+/)
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 2);
  if (kws.length === 0) return 55;
  const lowerText = text.toLowerCase();
  const matched = kws.filter(kw => lowerText.includes(kw)).length;
  return clamp(35 + Math.round((matched / kws.length) * 55));
}

function scoreEmotionalAppeal(text: string): number {
  let score = 35;
  score += 9 * countMatches(text, [
    /боль|проблем|устали|tired|frustrated|надоело/i,
    /мечт|dream|хотите|want|желаете/i,
    /страх|fear|риск|risk|потер|lose/i,
    /успех|success|результат|result|победа|win/i,
    /экономи|save|сэкономить|дешевле|cheaper/i,
    /надежн|reliable|доверяют|trust/i,
  ]);
  const exclaims = (text.match(/!/g) || []).length;
  if (exclaims === 1) score += 5;
  if (exclaims > 2) score -= 5;
  return clamp(score);
}

function scoreUniqueness(text: string): number {
  let score = 70;
  const generic = [
    /высокое\s+качество|high\s+quality/i,
    /лучший\s+выбор|best\s+choice/i,
    /мы\s+лучшие|we\s+are\s+the\s+best/i,
    /нажмите\s+здесь|click\s+here/i,
  ];
  score -= 10 * countMatches(text, generic);
  if (/\d+/.test(text)) score += 10;
  if (/москв|спб|киев|almaty|dubai|london/i.test(text)) score += 8;
  return clamp(score);
}

// ─── Recommendations ──────────────────────────────────────────────────────────

function buildRecommendations(breakdown: CTRBreakdownItem[], language: string): string[] {
  const isRu = language === "Russian";
  const recs: string[] = [];
  const get = (key: CTRBreakdownKey) => breakdown.find(b => b.key === key)!;

  const hl  = get("headlineStrength");
  const cta = get("callToAction");
  const kw  = get("keywordRelevance");
  const em  = get("emotionalAppeal");
  const un  = get("uniqueness");

  if (hl.score < 65) recs.push(isRu
    ? "Добавьте конкретное число или статистику — объявления с цифрами получают на 36% больше кликов (например: «Доставка за 2 часа», «500+ клиентов»)"
    : "Add a specific number or stat — ads with numbers get 36% more clicks (e.g., 'Delivery in 2 Hours', '500+ Clients')");

  if (cta.score < 55) recs.push(isRu
    ? "Добавьте сильный призыв к действию: «Получить бесплатно», «Записаться сейчас», «Рассчитать стоимость» — слабые CTA снижают CTR на 20–40%"
    : "Add a strong CTA: 'Get Free', 'Book Now', 'Get Instant Quote' — weak CTAs lower CTR by 20–40%");

  if (kw.score < 60) recs.push(isRu
    ? "Включите целевые ключевые слова прямо в заголовки — точное совпадение с запросом выделяет объявление жирным в выдаче"
    : "Include target keywords directly in headlines — exact match makes your ad bold in search results");

  if (em.score < 55) recs.push(isRu
    ? "Обратитесь к боли пользователя: «Устали от слива бюджета?» или «Нет заявок из Google Ads?» — вопросные заголовки повышают CTR"
    : "Address user pain: 'Tired of Wasted Ad Spend?' or 'No Leads From Google Ads?' — question headlines boost CTR");

  if (un.score < 55) recs.push(isRu
    ? "Замените общие фразы конкретными: «Высокое качество» ничего не говорит, «CTR ×3 за 30 дней» — говорит всё"
    : "Replace generic phrases with specifics: 'High Quality' says nothing; 'CTR ×3 in 30 days' says everything");

  if (recs.length < 3) recs.push(isRu
    ? "Протестируйте заголовок-вопрос — «Ищете [продукт]?» точно совпадает с намерением поиска"
    : "Test a question headline — 'Looking for [product]?' exactly matches search intent");

  if (recs.length < 3) recs.push(isRu
    ? "Добавьте социальное доказательство в описание — «10 000+ клиентов», «Рейтинг 4.9 ★» повышают доверие"
    : "Add social proof to a description — '10,000+ clients', '4.9 ★ rating' instantly boost trust");

  return recs.slice(0, 7);
}

// ─── Improved version ─────────────────────────────────────────────────────────

function buildImprovedVersion(text: string, keywords: string, language: string) {
  const isRu = language === "Russian";
  const kws = keywords.split(/[,;|\n]+/).map(k => k.trim()).filter(k => k.length > 2).slice(0, 2);
  const kw1 = kws[0] ?? (isRu ? "Ваш продукт" : "Your Product");
  const kw2 = kws[1] ?? kw1;
  void text;
  if (isRu) {
    return {
      headlines: [
        `${kw1.slice(0, 22)} — быстрый старт`.slice(0, 30),
        `${kw2.slice(0, 18)} от профессионалов`.slice(0, 30),
        "Бесплатная консультация",
      ],
      description: `${kw1} с гарантией качества. Индивидуальный подход и реальные результаты. Оставьте заявку!`.slice(0, 90),
    };
  }
  return {
    headlines: [
      `${kw1.slice(0, 20)} — Get Started Fast`.slice(0, 30),
      `${kw2.slice(0, 16)} by Professionals`.slice(0, 30),
      "Free Consultation Today",
    ],
    description: `${kw1} with guaranteed quality. Personalised approach and real results. Request a free quote!`.slice(0, 90),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function analyzeCTR(
  adCopy: string,
  keywords: string,
  industry: string,
  language: string
): CTRAnalysisResult {
  const isRu = language === "Russian";
  const text = adCopy.trim();

  void industry; // reserved for future industry-specific rules

  const hl  = scoreHeadlineStrength(text);
  const cta = scoreCallToAction(text);
  const kw  = scoreKeywordRelevance(text, keywords);
  const em  = scoreEmotionalAppeal(text);
  const un  = scoreUniqueness(text);

  const breakdown: CTRBreakdownItem[] = [
    { key: "headlineStrength", score: hl,  status: toStatus(hl) },
    { key: "callToAction",     score: cta, status: toStatus(cta) },
    { key: "keywordRelevance", score: kw,  status: toStatus(kw) },
    { key: "emotionalAppeal",  score: em,  status: toStatus(em) },
    { key: "uniqueness",       score: un,  status: toStatus(un) },
  ];

  const overallScore = clamp(
    Math.round(hl * 0.25 + cta * 0.20 + kw * 0.25 + em * 0.15 + un * 0.15)
  );

  const { headlines, description } = buildImprovedVersion(text, keywords, language);

  return {
    overallScore,
    breakdown,
    recommendations: buildRecommendations(breakdown, language),
    improvedHeadlines: headlines,
    improvedDescription: description,
    checkedAt: isRu ? "Только что · Локальный анализ" : "Just now · Local analysis",
    aiMode: "fallback",
  };
}
