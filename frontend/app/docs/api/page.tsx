"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

type Method = "POST" | "GET" | "DELETE";
const METHOD_COLORS: Record<Method, string> = {
  POST:   "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  GET:    "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  DELETE: "bg-red-500/15 text-red-300 border-red-500/25",
};

interface Endpoint {
  id: string;
  method: Method;
  path: string;
  title: string;
  desc: string;
  request?: { field: string; type: string; required: boolean; desc: string }[];
  response: string;
}

const CONTENT = {
  en: {
    breadcrumbDocs: "Docs",
    breadcrumbApi: "API Reference",
    backLabel: "Back",
    pageTitle: "API Reference",
    pageSubtitle: "The AdPilot AI REST API lets you programmatically generate ads, check moderation, and analyze CTR. All endpoints return JSON.",
    baseUrlLabel: "Base URL",
    contentsLabel: "API Reference",
    authTitle: "Authentication",
    authDesc: "All API requests require a valid API key passed in the",
    authDesc2: "header. Generate API keys in your dashboard under",
    authDesc3: "Settings → API Keys",
    authCodeLabel: "Example request header",
    authNote: "Keep your API key secret. Rotate compromised keys immediately from the dashboard.",
    rateLimitsTitle: "Rate Limits",
    rateLimitsCols: ["Plan", "Requests/minute", "Monthly limit"],
    rateLimitsRows: [
      ["Starter", "10 req/min", "100 requests"],
      ["Growth", "60 req/min", "1,000 requests"],
      ["Enterprise", "300 req/min", "Unlimited"],
    ],
    rateLimitsNote: "Rate limit headers are returned with every response:",
    requestBodyLabel: "Request Body",
    responseLabel: "Response",
    responseOk: "200 OK — application/json",
    fieldCol: "Field",
    typeCol: "Type",
    requiredCol: "Required",
    descCol: "Description",
    requiredVal: "required",
    optionalVal: "optional",
    navSections: [
      { id: "authentication", label: "Authentication" },
      { id: "rate-limits",    label: "Rate Limits" },
      { id: "rsa-generate",   label: "POST /rsa/generate" },
      { id: "moderation-check", label: "POST /moderation/check" },
      { id: "ctr-analyze",    label: "GET /ctr/analyze" },
      { id: "usage",          label: "GET /account/usage" },
    ],
    endpoints: [
      {
        id: "rsa-generate",
        method: "POST" as Method,
        path: "/v1/rsa/generate",
        title: "Generate RSA Ad Copy",
        desc: "Generates 15 headlines, 4 descriptions, CTA suggestions, and a moderation risk score for a given campaign brief.",
        request: [
          { field: "niche",    type: "string",   required: true,  desc: "Business or product description (50–500 chars)" },
          { field: "language", type: "string",   required: true,  desc: "Output language code, e.g. 'en', 'ru', 'de'" },
          { field: "country",  type: "string",   required: true,  desc: "ISO 3166-1 alpha-2 country code, e.g. 'US', 'RU'" },
          { field: "goal",     type: "string",   required: true,  desc: "Campaign goal: 'conversions' | 'leads' | 'traffic' | 'brand' | 'app_installs' | 'sales' | 'local'" },
          { field: "tone",     type: "string",   required: true,  desc: "Ad tone: 'professional' | 'persuasive' | 'urgent' | 'friendly' | 'authoritative' | 'casual' | 'luxury' | 'technical'" },
          { field: "keywords", type: "string[]", required: false, desc: "Optional seed keywords to include in generated copy" },
        ],
        response: `{
  "id": "rsa_01HX9J2K4M...",
  "headlines": [
    { "text": "Award-Winning PPC Agency", "strength": "excellent", "score": 94 },
    { "text": "Scale Your ROI by 300%",   "strength": "excellent", "score": 92 }
    // ... 13 more
  ],
  "descriptions": [
    { "text": "We manage Google Ads for 500+ brands...", "strength": "excellent", "score": 93 }
    // ... 3 more
  ],
  "cta_suggestions": ["Start Your Free Trial", "Get a Free Audit Today"],
  "moderation": {
    "score": 81,
    "level": "LOW",
    "flags": [
      { "field": "Scale Your ROI by 300%", "issue": "Unsubstantiated claim", "severity": "low", "safer": "Significantly Boost Your ROI" }
    ]
  },
  "generated_at": "2025-01-15T10:23:41Z",
  "latency_ms": 2340
}`,
      },
      {
        id: "moderation-check",
        method: "POST" as Method,
        path: "/v1/moderation/check",
        title: "Check Ad Moderation",
        desc: "Analyzes provided ad copy for Google Ads policy violations and returns a risk score with actionable fixes.",
        request: [
          { field: "headlines",    type: "string[]", required: true,  desc: "Array of 1–15 headline strings (max 30 chars each)" },
          { field: "descriptions", type: "string[]", required: false, desc: "Array of 1–4 description strings (max 90 chars each)" },
          { field: "language",     type: "string",   required: false, desc: "Language code for context-aware policy checking" },
        ],
        response: `{
  "score": 78,
  "level": "MEDIUM",
  "flags": [
    {
      "field": "Best Google Ads Tool",
      "issue": "Superlative claim without substantiation",
      "severity": "medium",
      "safer": "Top-Rated Google Ads Tool"
    }
  ],
  "safe_count": 12,
  "flagged_count": 3
}`,
      },
      {
        id: "ctr-analyze",
        method: "GET" as Method,
        path: "/v1/ctr/analyze",
        title: "Analyze CTR Score",
        desc: "Scores your existing ad copy against predicted CTR benchmarks and returns improvement recommendations.",
        request: [
          { field: "headlines",    type: "string[]", required: true,  desc: "Array of existing headlines to score" },
          { field: "descriptions", type: "string[]", required: true,  desc: "Array of existing descriptions to score" },
          { field: "industry",     type: "string",   required: false, desc: "Industry vertical for benchmark comparison" },
        ],
        response: `{
  "overall_score": 67,
  "breakdown": [
    { "name": "Headline Strength",  "score": 72, "status": "good" },
    { "name": "Call to Action",     "score": 45, "status": "needs_work" },
    { "name": "Keyword Relevance",  "score": 88, "status": "excellent" }
  ],
  "recommendations": [
    "Add urgency trigger in at least 2 headlines (e.g., 'Today Only')",
    "Replace generic CTA 'Click Here' with 'Start Free Trial'"
  ]
}`,
      },
      {
        id: "usage",
        method: "GET" as Method,
        path: "/v1/account/usage",
        title: "Get Account Usage",
        desc: "Returns current billing period usage statistics for your account or workspace.",
        request: [],
        response: `{
  "plan": "growth",
  "period": { "start": "2025-01-01", "end": "2025-01-31" },
  "ads_generated": { "used": 247, "limit": 500 },
  "api_calls":    { "used": 1842, "limit": 1000 },
  "moderation_checks": { "used": 89, "limit": null }
}`,
      },
    ] as Endpoint[],
  },
  ru: {
    breadcrumbDocs: "Документация",
    breadcrumbApi: "Справочник API",
    backLabel: "Назад",
    pageTitle: "Справочник API",
    pageSubtitle: "REST API AdPilot AI позволяет программно генерировать объявления, проверять модерацию и анализировать CTR. Все эндпоинты возвращают JSON.",
    baseUrlLabel: "Базовый URL",
    contentsLabel: "Справочник API",
    authTitle: "Аутентификация",
    authDesc: "Все запросы к API требуют действующего API-ключа, передаваемого в заголовке",
    authDesc2: ". Создавайте API-ключи в личном кабинете в разделе",
    authDesc3: "Настройки → API-ключи",
    authCodeLabel: "Пример заголовка запроса",
    authNote: "Храните API-ключ в тайне. При компрометации немедленно смените его в личном кабинете.",
    rateLimitsTitle: "Лимиты запросов",
    rateLimitsCols: ["Тариф", "Запросов/минута", "Лимит в месяц"],
    rateLimitsRows: [
      ["Старт", "10 зап./мин", "100 запросов"],
      ["Рост", "60 зап./мин", "1 000 запросов"],
      ["Энтерпрайз", "300 зап./мин", "Безлимит"],
    ],
    rateLimitsNote: "С каждым ответом возвращаются заголовки лимитов:",
    requestBodyLabel: "Тело запроса",
    responseLabel: "Ответ",
    responseOk: "200 OK — application/json",
    fieldCol: "Поле",
    typeCol: "Тип",
    requiredCol: "Обязательно",
    descCol: "Описание",
    requiredVal: "обязательно",
    optionalVal: "необязательно",
    navSections: [
      { id: "authentication",   label: "Аутентификация" },
      { id: "rate-limits",      label: "Лимиты запросов" },
      { id: "rsa-generate",     label: "POST /rsa/generate" },
      { id: "moderation-check", label: "POST /moderation/check" },
      { id: "ctr-analyze",      label: "GET /ctr/analyze" },
      { id: "usage",            label: "GET /account/usage" },
    ],
    endpoints: [
      {
        id: "rsa-generate",
        method: "POST" as Method,
        path: "/v1/rsa/generate",
        title: "Генерация RSA-объявления",
        desc: "Генерирует 15 заголовков, 4 описания, варианты CTA и оценку риска модерации для заданного брифа кампании.",
        request: [
          { field: "niche",    type: "string",   required: true,  desc: "Описание бизнеса или продукта (50–500 символов)" },
          { field: "language", type: "string",   required: true,  desc: "Код языка вывода, напр. 'en', 'ru', 'de'" },
          { field: "country",  type: "string",   required: true,  desc: "Код страны ISO 3166-1 alpha-2, напр. 'RU', 'US'" },
          { field: "goal",     type: "string",   required: true,  desc: "Цель кампании: 'conversions' | 'leads' | 'traffic' | 'brand' | 'app_installs' | 'sales' | 'local'" },
          { field: "tone",     type: "string",   required: true,  desc: "Тон объявления: 'professional' | 'persuasive' | 'urgent' | 'friendly' | 'authoritative' | 'casual' | 'luxury' | 'technical'" },
          { field: "keywords", type: "string[]", required: false, desc: "Необязательные ключевые слова для включения в текст" },
        ],
        response: `{
  "id": "rsa_01HX9J2K4M...",
  "headlines": [
    { "text": "Контекст под ключ за 3 дня", "strength": "excellent", "score": 95 },
    { "text": "Лиды из Google от 200 руб.", "strength": "excellent", "score": 93 }
    // ... ещё 13
  ],
  "descriptions": [
    { "text": "Ведём Google Ads для 500+ клиентов. CTR в среднем ×3.", "strength": "excellent", "score": 94 }
    // ... ещё 3
  ],
  "cta_suggestions": ["Получить бесплатный аудит", "Оставить заявку"],
  "moderation": {
    "score": 84,
    "level": "LOW",
    "flags": [
      { "field": "Лиды из Google от 200 руб.", "issue": "Конкретная цена", "severity": "low", "safer": "Лиды из Google. Выгодная цена." }
    ]
  },
  "generated_at": "2025-01-15T10:23:41Z",
  "latency_ms": 2340
}`,
      },
      {
        id: "moderation-check",
        method: "POST" as Method,
        path: "/v1/moderation/check",
        title: "Проверка модерации объявления",
        desc: "Анализирует текст объявления на нарушения политики Google Ads и возвращает оценку риска с конкретными рекомендациями по исправлению.",
        request: [
          { field: "headlines",    type: "string[]", required: true,  desc: "Массив из 1–15 заголовков (макс. 30 символов каждый)" },
          { field: "descriptions", type: "string[]", required: false, desc: "Массив из 1–4 описаний (макс. 90 символов каждое)" },
          { field: "language",     type: "string",   required: false, desc: "Код языка для контекстно-зависимой проверки политики" },
        ],
        response: `{
  "score": 78,
  "level": "MEDIUM",
  "flags": [
    {
      "field": "Лучший инструмент для Google Ads",
      "issue": "Суперлативное заявление без подтверждения",
      "severity": "medium",
      "safer": "Топовый инструмент для Google Ads"
    }
  ],
  "safe_count": 12,
  "flagged_count": 3
}`,
      },
      {
        id: "ctr-analyze",
        method: "GET" as Method,
        path: "/v1/ctr/analyze",
        title: "Анализ оценки CTR",
        desc: "Оценивает существующие тексты объявлений по прогнозируемым CTR-бенчмаркам и возвращает рекомендации по улучшению.",
        request: [
          { field: "headlines",    type: "string[]", required: true,  desc: "Массив существующих заголовков для оценки" },
          { field: "descriptions", type: "string[]", required: true,  desc: "Массив существующих описаний для оценки" },
          { field: "industry",     type: "string",   required: false, desc: "Отраслевой вертикал для сравнения с бенчмарком" },
        ],
        response: `{
  "overall_score": 67,
  "breakdown": [
    { "name": "Сила заголовков",    "score": 72, "status": "good" },
    { "name": "Призыв к действию",  "score": 45, "status": "needs_work" },
    { "name": "Релевантность ключей","score": 88, "status": "excellent" }
  ],
  "recommendations": [
    "Добавьте триггер срочности минимум в 2 заголовка (напр., 'Только сегодня')",
    "Замените общий CTA 'Нажмите здесь' на 'Получить бесплатный аудит'"
  ]
}`,
      },
      {
        id: "usage",
        method: "GET" as Method,
        path: "/v1/account/usage",
        title: "Статистика использования аккаунта",
        desc: "Возвращает статистику использования за текущий расчётный период для вашего аккаунта или рабочего пространства.",
        request: [],
        response: `{
  "plan": "growth",
  "period": { "start": "2025-01-01", "end": "2025-01-31" },
  "ads_generated": { "used": 247, "limit": 500 },
  "api_calls":    { "used": 1842, "limit": 1000 },
  "moderation_checks": { "used": 89, "limit": null }
}`,
      },
    ] as Endpoint[],
  },
};

export default function ApiReferencePage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;
  const [activeSection, setActiveSection] = useState("authentication");

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-white/35 mb-8"
          >
            <Link href="/docs" className="hover:text-white/70 transition-colors">{c.breadcrumbDocs}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/55">{c.breadcrumbApi}</span>
          </motion.div>

          <div className="flex gap-10 items-start">

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block w-52 flex-shrink-0 sticky top-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <Link href="/docs" className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                  <ArrowLeft className="w-3 h-3" />
                  {c.backLabel}
                </Link>
              </div>
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">{c.contentsLabel}</p>
              <nav className="space-y-0.5">
                {c.navSections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm transition-colors",
                      activeSection === s.id
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </motion.aside>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 min-w-0 space-y-14"
            >
              {/* Base URL */}
              <div>
                <h1 className="text-3xl font-black text-white mb-3">{c.pageTitle}</h1>
                <p className="text-white/50 mb-4">{c.pageSubtitle}</p>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-wider">{c.baseUrlLabel}</span>
                  <code className="text-sm font-mono text-indigo-300">https://api.adpilot.ai</code>
                </div>
              </div>

              {/* Authentication */}
              <section id="authentication">
                <h2 className="text-xl font-bold text-white mb-4">{c.authTitle}</h2>
                <p className="text-sm text-white/55 leading-relaxed mb-4">
                  {c.authDesc} <code className="text-xs bg-white/[0.06] px-1.5 py-0.5 rounded font-mono text-indigo-300">Authorization</code>
                  {c.authDesc2} <strong className="text-white/70">{c.authDesc3}</strong>.
                </p>
                <div className="rounded-xl border border-white/[0.08] bg-[#0d0d14] overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-white/[0.06] text-xs font-mono text-white/30">{c.authCodeLabel}</div>
                  <pre className="p-4 text-sm font-mono text-white/60 overflow-x-auto">
                    <span className="text-indigo-300">Authorization</span>
                    <span className="text-white/40">: Bearer </span>
                    <span className="text-emerald-400">ap_live_xxxxxxxxxxxxxxxxxxxxxxxx</span>
                  </pre>
                </div>
                <p className="text-xs text-white/35 mt-3">{c.authNote}</p>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits">
                <h2 className="text-xl font-bold text-white mb-4">{c.rateLimitsTitle}</h2>
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
                  <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/[0.07] px-4 py-2.5">
                    {c.rateLimitsCols.map((h) => (
                      <span key={h} className="text-xs font-bold text-white/30 uppercase tracking-widest">{h}</span>
                    ))}
                  </div>
                  {c.rateLimitsRows.map(([plan, rpm, monthly], i) => (
                    <div key={plan} className={cn("grid grid-cols-3 px-4 py-3 text-sm", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                      <span className="text-white/70 font-medium">{plan}</span>
                      <span className="text-white/45">{rpm}</span>
                      <span className="text-white/45">{monthly}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/35 mt-3">
                  {c.rateLimitsNote} <code className="font-mono text-indigo-300/70">X-RateLimit-Remaining</code>, <code className="font-mono text-indigo-300/70">X-RateLimit-Reset</code>.
                </p>
              </section>

              {/* Endpoints */}
              {c.endpoints.map((ep) => (
                <section key={ep.id} id={ep.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={cn("text-xs font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", METHOD_COLORS[ep.method])}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-white/75">{ep.path}</code>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{ep.title}</h2>
                  <p className="text-sm text-white/55 leading-relaxed mb-6">{ep.desc}</p>

                  {ep.request && ep.request.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">{c.requestBodyLabel}</h3>
                      <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                        <div className="grid grid-cols-4 bg-white/[0.03] border-b border-white/[0.07] px-4 py-2.5">
                          {[c.fieldCol, c.typeCol, c.requiredCol, c.descCol].map((h) => (
                            <span key={h} className="text-xs font-bold text-white/25 uppercase tracking-widest">{h}</span>
                          ))}
                        </div>
                        {ep.request.map((r, i) => (
                          <div key={r.field} className={cn("grid grid-cols-4 px-4 py-3 gap-2 text-xs", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                            <code className="font-mono text-indigo-300">{r.field}</code>
                            <span className="text-violet-400/70 font-mono">{r.type}</span>
                            <span className={r.required ? "text-amber-400/70" : "text-white/25"}>
                              {r.required ? c.requiredVal : c.optionalVal}
                            </span>
                            <span className="text-white/40">{r.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">{c.responseLabel}</h3>
                    <div className="rounded-xl border border-white/[0.08] bg-[#0d0d14] overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-mono text-white/30">{c.responseOk}</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-white/50 overflow-x-auto leading-relaxed">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                </section>
              ))}

            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
