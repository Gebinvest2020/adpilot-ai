/**
 * Rule-based Google Ads policy risk analyzer.
 * Used as fallback when OpenAI API is unavailable.
 */

import type { ModerationCategory, ModerationPolicyFlag, ModerationCheckResult } from "@/lib/mock-data";

interface RiskRule {
  patterns: RegExp[];
  category: ModerationCategory;
  severity: "low" | "medium" | "high";
  explanationRu: string;
  explanationEn: string;
  saferRu: string;
  saferEn: string;
}

// ─── Risk rule database ───────────────────────────────────────────────────────

const RULES: RiskRule[] = [
  // ── FINANCIAL: guaranteed returns ─────────────────────────────────────────
  {
    patterns: [
      /гарантир[а-яё]+\s+(?:доход|прибыл|возврат|окупаемост)/i,
      /guaranteed?\s+(?:income|returns?|profit|yield|earnings?)/i,
      /100%\s*(?:гарантия|возврат|прибыль|return|guarantee)/i,
    ],
    category: "financial",
    severity: "high",
    explanationRu: "Гарантии дохода или прибыли запрещены политикой Google Ads для финансовых продуктов и услуг.",
    explanationEn: "Guaranteed income or profit claims violate Google Ads financial advertising policies.",
    saferRu: "«Узнайте о потенциальной доходности» или «Высокий потенциал роста»",
    saferEn: "\"Learn about potential returns\" or \"High growth potential\"",
  },

  // ── FINANCIAL: risk-free investing ────────────────────────────────────────
  {
    patterns: [
      /без\s+риска|безрисков/i,
      /risk[\s-]?free\s+invest/i,
      /инвестиц[а-яё]+\s+без\s+риска/i,
    ],
    category: "financial",
    severity: "medium",
    explanationRu: "Заявления «без риска» для инвестиций нарушают финансовую политику Google Ads.",
    explanationEn: "\"Risk-free\" investment claims violate Google's financial advertising policy.",
    saferRu: "«Управление рисками» или «Диверсифицированный портфель»",
    saferEn: "\"Risk management\" or \"Diversified portfolio approach\"",
  },

  // ── CRYPTO: profit promises ───────────────────────────────────────────────
  {
    patterns: [
      /крипт[а-яё]+\s+(?:заработ|доход|прибыл|трейдинг\s+доход)/i,
      /earn(?:ing)?s?\s+(?:with|from|on)\s+crypto/i,
      /crypto\s+(?:profit|earn|income|gains?|trading\s+profit)/i,
      /bitcoin\s+(?:profit|earn|income|returns?)/i,
      /биткоин\s+(?:заработ|доход|прибыл)/i,
    ],
    category: "crypto",
    severity: "high",
    explanationRu: "Реклама криптовалюты с обещаниями заработка нарушает политику Google и может заблокировать аккаунт.",
    explanationEn: "Crypto ads promising earnings violate Google's cryptocurrency advertising policy and risk account suspension.",
    saferRu: "«Обучение криптовалюте» или «Анализ крипторынка»",
    saferEn: "\"Learn about cryptocurrency\" or \"Crypto market analysis\"",
  },

  // ── HEALTHCARE: disease cure claims ──────────────────────────────────────
  {
    patterns: [
      /вылечи[а-яё]+|вылечим\b|излечени[ея]/i,
      /лечени[ея]\s+рак|лечит\s+(?:рак|диабет|гипертонию)/i,
      /cures?\s+(?:cancer|diabetes|hiv|disease)/i,
      /treats?\s+(?:cancer|hiv|diabetes|alzheimer)/i,
      /eliminates?\s+(?:cancer|disease|diabetes)/i,
    ],
    category: "healthcare",
    severity: "high",
    explanationRu: "Утверждения о лечении болезней запрещены без клинического подтверждения. Нарушение политики Google Health.",
    explanationEn: "Disease treatment claims are prohibited without verified clinical evidence. Violates Google Health policy.",
    saferRu: "«Консультация специалиста» или «Поддержка здоровья»",
    saferEn: "\"Specialist consultation\" or \"Health support\"",
  },

  // ── HEALTHCARE: supplement cure claims ───────────────────────────────────
  {
    patterns: [
      /похуде[а-яё]+\s+(?:на\s+)?\d+\s*(?:кг|kg)\s+за\s+(?:\d+\s+)?(?:недел|день|месяц)/i,
      /lose\s+\d+\s*(?:lbs?|kg)\s+in\s+(?:\d+\s+)?(?:day|week|month)/i,
      /сжигает?\s+жир\s+без\s+(?:диет|спорт)/i,
      /burns?\s+fat\s+without\s+(?:diet|exercise)/i,
      /гарантир[а-яё]+\s+(?:похудение|снижение\s+веса)/i,
      /guaranteed?\s+weight\s+loss/i,
    ],
    category: "healthcare",
    severity: "high",
    explanationRu: "Конкретные обещания похудения за заданное время нарушают политику Google и вводят в заблуждение.",
    explanationEn: "Specific weight-loss promises within a timeframe violate Google policy and are misleading.",
    saferRu: "«Поддержка здорового образа жизни» или «Комплекс для активного метаболизма»",
    saferEn: "\"Healthy lifestyle support\" or \"Active metabolism complex\"",
  },

  // ── UNREALISTIC: extreme ROI numbers ─────────────────────────────────────
  {
    patterns: [
      /[3-9]\d{2,}\s*%\s+(?:доход|прибыл|рост|return|profit|yield)/i,
      /(?:10|20|50|100)[x×]\s*(?:доход|return|profit|money)/i,
      /утрой\s+(?:капитал|деньги|вложени)/i,
      /(?:double|triple|10x)\s+your\s+(?:money|investment|returns?)/i,
    ],
    category: "unrealistic",
    severity: "high",
    explanationRu: "Обещания сверхвысокой доходности (300%+) нарушают политику Google как вводящие в заблуждение.",
    explanationEn: "Promises of extreme returns (300%+) violate Google's misleading content policy.",
    saferRu: "Укажите реалистичные данные или используйте «Узнать условия»",
    saferEn: "Use realistic figures or \"Learn about terms and conditions\"",
  },

  // ── EMPLOYMENT: income promises ───────────────────────────────────────────
  {
    patterns: [
      /заработ[аи][йте]{0,2}\s+\$?\d[\d,.]*/i,
      /зарабатывай\s+\$?\d+/i,
      /доход\s+(?:до\s+)?\$?\d+\s+в\s+(?:день|месяц|час)/i,
      /earn\s+\$?\d+[\s+](?:a|per)\s+(?:day|month|hour|week)/i,
      /make\s+\$?\d+\s+(?:daily|monthly|per\s+day|per\s+month)/i,
      /\$\d+\s*\/\s*(?:day|hour|month)\s+from\s+home/i,
    ],
    category: "employment",
    severity: "high",
    explanationRu: "Конкретные обещания дохода нарушают политику занятости Google Ads.",
    explanationEn: "Specific income promises violate Google's employment advertising policy.",
    saferRu: "«Конкурентная зарплата» или «Гибкий заработок»",
    saferEn: "\"Competitive compensation\" or \"Flexible earnings\"",
  },

  // ── MISLEADING: world's best / #1 ────────────────────────────────────────
  {
    patterns: [
      /(?:лучший|первый|#1)\s+в\s+(?:мире|России|Европе|стране)/i,
      /world'?s?\s+(?:#\s*1|best|leading|top)\s+(?:provider|agency|company)/i,
      /(?:the\s+)?(?:number\s+one|#1|top)\s+(?:in\s+the\s+world|globally)/i,
    ],
    category: "misleading",
    severity: "medium",
    explanationRu: "Заявления «лучший в мире» требуют подтверждения независимыми исследованиями или рейтингами.",
    explanationEn: "'Best in the world' claims require substantiation with independent research or ratings.",
    saferRu: "«Один из ведущих» или добавьте источник данных",
    saferEn: "\"One of the leading\" or add a data source citation",
  },

  // ── MISLEADING: fake urgency ──────────────────────────────────────────────
  {
    patterns: [
      /только\s+(?:сегодня|сейчас)\s+(?:\d|\d+\s+мест|скидка)/i,
      /осталось\s+\d+\s+мест/i,
      /(?:limited\s+spots?|only\s+\d+\s+left|selling\s+fast)/i,
      /(?:act\s+now|hurry|don't\s+miss)\s+—?\s+(?:only|just)\s+\d+/i,
    ],
    category: "misleading",
    severity: "low",
    explanationRu: "Искусственная срочность без конкретных подтверждённых условий может нарушать политику.",
    explanationEn: "Artificial urgency without verified specific terms may violate misleading content policy.",
    saferRu: "«Акция до [конкретная дата]» с реальными условиями",
    saferEn: "\"Sale ends [specific date]\" with real verifiable terms",
  },

  // ── SENSATIONAL: shocking language ───────────────────────────────────────
  {
    patterns: [
      /шокирующ[а-яё]+|сенсационн[а-яё]+|невероятн[а-яё]+\s+результат/i,
      /shocking\s+results?|amazing\s+results?|incredible\s+results?/i,
      /НЕВЕРОЯТНО|ШОКИРУЮЩЕ|СРОЧНО|ВНИМАНИЕ\s*!/i,
      /\bWOW\b|\bCRAZY\b|\bINSANE\b|\bSTUNNING\b/i,
    ],
    category: "sensational",
    severity: "medium",
    explanationRu: "Сенсационные заявления снижают показатель качества рекламы и могут вызвать проверку.",
    explanationEn: "Sensational language lowers ad quality score and may trigger a policy review.",
    saferRu: "Замените конкретными фактами и измеримыми результатами",
    saferEn: "Replace with specific facts and measurable outcomes",
  },

  // ── SENSATIONAL: ALL CAPS abuse ───────────────────────────────────────────
  {
    patterns: [
      /[А-ЯЁ]{5,}/,
      /[A-Z]{5,}/,
    ],
    category: "sensational",
    severity: "low",
    explanationRu: "Текст в ВЕРХНЕМ РЕГИСТРЕ нарушает правила оформления объявлений Google Ads.",
    explanationEn: "ALL CAPS text violates Google Ads capitalization policies for ad copy.",
    saferRu: "Используйте стандартный регистр: только первая буква заглавная",
    saferEn: "Use standard capitalization: only first letter capitalized",
  },

  // ── MISLEADING: 100% guarantee / result ──────────────────────────────────
  {
    patterns: [
      /100%\s*(?:гарантия|гарантир|результат|эффект|успех)/i,
      /100%\s*(?:guarantee|result|success|effective)/i,
      /гарантир[а-яё]+\s+(?:результат|успех|эффект)/i,
    ],
    category: "misleading",
    severity: "high",
    explanationRu: "Гарантии 100% результата без доказательств нарушают политику Google Ads.",
    explanationEn: "100% result/guarantee claims without evidence violate Google Ads policy.",
    saferRu: "«Высокая эффективность» или «Доказанные результаты»",
    saferEn: "\"High effectiveness\" or \"Proven results\"",
  },

  // ── FINANCIAL: "доход без риска" ─────────────────────────────────────────
  {
    patterns: [
      /доход\s+без\s+риска/i,
      /заработок\s+без\s+риска/i,
      /прибыль\s+без\s+риска/i,
    ],
    category: "financial",
    severity: "high",
    explanationRu: "«Доход без риска» нарушает политику финансовой рекламы Google.",
    explanationEn: "\"Income without risk\" violates Google's financial advertising policy.",
    saferRu: "«Управляемые финансовые риски» или «Сбалансированный портфель»",
    saferEn: "\"Managed financial risk\" or \"Balanced portfolio approach\"",
  },
];

// ─── Safe item patterns ───────────────────────────────────────────────────────

const SAFE_PATTERNS: { patterns: RegExp[]; labelRu: string; labelEn: string }[] = [
  {
    patterns: [/узнайте\s+(?:подробнее|больше|условия)|learn\s+more|find\s+out\s+more/i],
    labelRu: "Мягкий CTA без обещаний",
    labelEn: "Soft CTA without promises",
  },
  {
    patterns: [/консультация|consultation/i],
    labelRu: "Консультационный фрейм",
    labelEn: "Consultation framing",
  },
  {
    patterns: [/без\s+обязательств|no\s+commitment|no\s+obligation/i],
    labelRu: "Снятие барьера конверсии",
    labelEn: "Conversion barrier removal",
  },
  {
    patterns: [/подберём|подбор|помощь\s+в\s+выборе|we\s+help\s+you\s+find|find\s+the\s+right/i],
    labelRu: "Сервисный подход без давления",
    labelEn: "Service approach without pressure",
  },
  {
    patterns: [/бесплатная\s+консультация|free\s+consultation/i],
    labelRu: "Бесплатная консультация — низкий барьер",
    labelEn: "Free consultation — low barrier CTA",
  },
  {
    patterns: [/оставьте\s+заявку|submit\s+(?:a\s+)?request|get\s+(?:a\s+)?quote/i],
    labelRu: "Стандартный CTA заявки",
    labelEn: "Standard lead CTA",
  },
  {
    patterns: [/информационный|образовательный|educational|informational/i],
    labelRu: "Образовательный фрейм",
    labelEn: "Educational framing",
  },
  {
    patterns: [/(?:в\s+)?(?:Москве|Кишинёве|Ереване|Алматы|Moscow|Kyiv|Dubai|London)/i],
    labelRu: "Геолокационный таргетинг",
    labelEn: "Geo-targeting signal",
  },
];

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(flags: ModerationPolicyFlag[]): number {
  let score = 100;
  for (const f of flags) {
    if (f.severity === "high")   score -= 18;
    else if (f.severity === "medium") score -= 9;
    else                              score -= 4;
  }
  return Math.max(5, Math.min(95, score));
}

function riskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score >= 75) return "LOW";
  if (score >= 45) return "MEDIUM";
  return "HIGH";
}

// ─── Summary builder ──────────────────────────────────────────────────────────

function buildSummary(
  flags: ModerationPolicyFlag[],
  score: number,
  lang: string
): string {
  const ru = lang === "Russian";
  const high   = flags.filter(f => f.severity === "high").length;
  const medium = flags.filter(f => f.severity === "medium").length;
  const low    = flags.filter(f => f.severity === "low").length;
  const total  = flags.length;

  if (total === 0) {
    return ru
      ? "Текст объявления соответствует политике Google Ads. Нарушений не обнаружено."
      : "Ad copy appears to comply with Google Ads policies. No violations detected.";
  }

  const level = riskLevel(score);
  if (ru) {
    const parts: string[] = [];
    if (high)   parts.push(`${high} критических нарушения`);
    if (medium) parts.push(`${medium} среднего уровня`);
    if (low)    parts.push(`${low} незначительных`);
    const summary = `Обнаружено ${total} нарушений: ${parts.join(", ")}.`;
    const advice = level === "HIGH"
      ? " Высокий риск отклонения объявлений и блокировки аккаунта. Требуется срочная правка."
      : level === "MEDIUM"
      ? " Рекомендуется исправить нарушения перед запуском кампании."
      : " Незначительные замечания, исправление улучшит качество объявлений.";
    return summary + advice;
  } else {
    const parts: string[] = [];
    if (high)   parts.push(`${high} critical`);
    if (medium) parts.push(`${medium} medium`);
    if (low)    parts.push(`${low} minor`);
    const summary = `Found ${total} policy ${total === 1 ? "violation" : "violations"}: ${parts.join(", ")}.`;
    const advice = level === "HIGH"
      ? " High risk of ad rejection and account suspension. Immediate fixes required."
      : level === "MEDIUM"
      ? " Fix violations before launching the campaign."
      : " Minor issues — fixing them will improve ad quality scores.";
    return summary + advice;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function checkModeration(
  adCopy: string,
  industry: string,
  language: string
): ModerationCheckResult {
  const isRu = language === "Russian";
  const text = adCopy.trim();
  const flags: ModerationPolicyFlag[] = [];
  const matchedTexts = new Set<string>();

  // Apply each rule
  for (let ruleIdx = 0; ruleIdx < RULES.length; ruleIdx++) {
    const rule = RULES[ruleIdx];
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        const trigger = match[0].trim();
        // Deduplicate by trigger text + category
        const key = `${rule.category}:${trigger.toLowerCase()}`;
        if (matchedTexts.has(key)) continue;
        matchedTexts.add(key);

        flags.push({
          id: `f${flags.length + 1}`,
          category: rule.category,
          severity: rule.severity,
          triggerText: trigger,
          explanation: isRu ? rule.explanationRu : rule.explanationEn,
          saferVersion: isRu ? rule.saferRu : rule.saferEn,
        });
        break; // One flag per rule
      }
    }
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Find safe items
  const safeItems: string[] = [];
  for (const safe of SAFE_PATTERNS) {
    if (safe.patterns.some(p => p.test(text))) {
      safeItems.push(isRu ? safe.labelRu : safe.labelEn);
    }
  }

  // Add industry-specific safe note if industry is set and low risk
  if (industry && flags.filter(f => f.severity === "high").length === 0) {
    safeItems.push(
      isRu
        ? `Отраслевой контекст «${industry}» учтён`
        : `Industry context "${industry}" considered`
    );
  }

  const score = calcScore(flags);
  const level = riskLevel(score);
  const now   = isRu ? "Только что · Локальный анализ" : "Just now · Local analysis";

  return {
    overallScore: score,
    riskLevel: level,
    summary: buildSummary(flags, score, language),
    flags,
    safeItems,
    checkedAt: now,
    aiMode: "fallback" as const,
  };
}
