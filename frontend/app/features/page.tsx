"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Shield, BarChart2, ArrowRight, Check, Brain,
  Globe, Target, TrendingUp, Lock, Cpu, Layers,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    badge: "Platform Features",
    headline: "Everything you need to",
    headlineGradient: "dominate Google Ads",
    subtitle: "Three AI-powered tools that cover the entire ad creation lifecycle — from generation to compliance to optimization.",
    ctaMain: "Start free trial",
    ctaSub: "View pricing",
    tools: [
      {
        icon: Zap,
        gradient: "from-indigo-500 to-violet-600",
        shadow: "shadow-indigo-500/25",
        badge: "RSA Generator",
        title: "Generate 15 headlines + 4 descriptions in seconds",
        desc: "Our AI writes Google-compliant Responsive Search Ads tailored to your niche, language, country, and campaign goal. Every asset is character-count validated and policy-checked before delivery.",
        bullets: [
          "15 headlines ≤30 chars each, 4 descriptions ≤90 chars",
          "16 languages including Russian, Arabic, Japanese",
          "30 target countries with CIS region support",
          "Strength scoring: Excellent / Good / Average / Weak",
          "Built-in Google Ads policy moderation layer",
          "10 CTA suggestions per generation",
          "AI strategy note explaining the copywriting approach",
        ],
        href: "/dashboard/rsa-generator",
      },
      {
        icon: Shield,
        gradient: "from-emerald-500 to-cyan-600",
        shadow: "shadow-emerald-500/25",
        badge: "Moderation Checker",
        title: "Pre-screen ads before they get rejected",
        desc: "Catch Google Ads policy violations before you submit. Our compliance engine checks for 8 risk categories — from financial fraud signals to healthcare claims — and provides safer rewrites.",
        bullets: [
          "8 risk categories: financial, crypto, healthcare, employment and more",
          "High / Medium / Low severity classification per flag",
          "Exact trigger phrase extraction with explanation",
          "AI-generated safer alternative for each violation",
          "Overall safety score 0–100 with risk level",
          "Positive compliance signals detection",
          "Bilingual analysis (EN + RU) out of the box",
        ],
        href: "/dashboard/moderation-checker",
      },
      {
        icon: BarChart2,
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/25",
        badge: "CTR Analyzer",
        title: "Score and improve your existing ad copy",
        desc: "Paste any ad copy and get a breakdown across 5 CTR-driving dimensions. The AI identifies what's dragging down performance and gives you actionable rewrites — not vague advice.",
        bullets: [
          "5 dimensions: Headline Strength, CTA, Keyword Relevance, Emotional Appeal, Uniqueness",
          "Weighted overall CTR score 0–100",
          "3–7 specific, actionable recommendations",
          "3 improved headline examples (≤30 chars each)",
          "1 improved description (≤90 chars)",
          "Status tags: Excellent / Good / Average / Needs Work",
          "Industry-aware analysis with keyword context",
        ],
        href: "/dashboard/ctr-analyzer",
      },
    ],
    statsLabel: "Platform stats",
    stats: [
      { value: "15+", label: "Supported languages" },
      { value: "30+", label: "Target countries" },
      { value: "8",   label: "Moderation categories" },
      { value: "5",   label: "CTR dimensions scored" },
    ],
    compLabel: "How AdPilot AI compares",
    compFeatures: [
      ["15 RSA headlines + 4 descriptions",  true, false, false],
      ["Policy moderation pre-screening",    true, false, false],
      ["CTR scoring with dimension breakdown",true, false, false],
      ["Character count validation",         true, true,  false],
      ["Russian + CIS market support",       true, false, false],
      ["Strength scoring per asset",         true, false, false],
      ["AI-generated safer alternatives",    true, false, false],
      ["API access",                         true, true,  true ],
    ],
    compCols: ["AdPilot AI", "Generic AI writers", "Manual copywriters"],
    principlesLabel: "Built on sound principles",
    principles: [
      { icon: Lock, title: "Policy-first design", desc: "Every generation pass runs through our compliance engine before you see the output." },
      { icon: Globe, title: "Global market support", desc: "CIS-native language handling, not just auto-translated Western copy." },
      { icon: Brain, title: "OpenAI GPT-4o mini", desc: "Server-side API calls — your key stays private, your prompts stay secure." },
      { icon: Cpu,   title: "Fallback engine",    desc: "Rule-based generator activates instantly if AI is unavailable. Zero downtime." },
      { icon: Layers, title: "REST API ready",   desc: "Every tool is available as a JSON API endpoint for your own integrations." },
      { icon: Target, title: "Goal-aware copy",  desc: "Ads are written for your campaign objective: leads, sales, awareness, or app installs." },
    ],
    ctaLabel: "Ready to start?",
    ctaDesc: "Generate your first RSA ad in under 60 seconds. No credit card required.",
  },
  ru: {
    badge: "Возможности платформы",
    headline: "Всё необходимое, чтобы",
    headlineGradient: "доминировать в Google Ads",
    subtitle: "Три AI-инструмента, охватывающих весь цикл создания объявлений — от генерации до проверки соответствия и оптимизации.",
    ctaMain: "Начать бесплатно",
    ctaSub: "Тарифные планы",
    tools: [
      {
        icon: Zap,
        gradient: "from-indigo-500 to-violet-600",
        shadow: "shadow-indigo-500/25",
        badge: "RSA Генератор",
        title: "15 заголовков + 4 описания за секунды",
        desc: "AI создаёт адаптивные поисковые объявления с учётом вашей ниши, языка, страны и цели кампании. Каждый элемент проходит проверку символов и политики перед выдачей.",
        bullets: [
          "15 заголовков ≤30 символов, 4 описания ≤90 символов",
          "16 языков включая русский, арабский, японский",
          "30 целевых стран с поддержкой СНГ-региона",
          "Оценка силы: Отлично / Хорошо / Средне / Слабо",
          "Встроенная проверка политики Google Ads",
          "10 вариантов CTA на каждую генерацию",
          "AI-заметка со стратегией копирайтинга",
        ],
        href: "/dashboard/rsa-generator",
      },
      {
        icon: Shield,
        gradient: "from-emerald-500 to-cyan-600",
        shadow: "shadow-emerald-500/25",
        badge: "Проверка модерации",
        title: "Проверяйте объявления до отклонения",
        desc: "Выявляйте нарушения политики Google Ads до публикации. Наш движок проверяет 8 категорий рисков — от финансовых сигналов до медицинских утверждений — и предлагает безопасные замены.",
        bullets: [
          "8 категорий риска: финансы, крипто, здравоохранение, занятость и др.",
          "Классификация по уровню серьёзности: Высокий / Средний / Низкий",
          "Извлечение точных триггерных фраз с объяснением",
          "AI-сгенерированные безопасные альтернативы",
          "Общий балл безопасности 0–100 с уровнем риска",
          "Определение положительных сигналов соответствия",
          "Двуязычный анализ (EN + RU) без дополнительной настройки",
        ],
        href: "/dashboard/moderation-checker",
      },
      {
        icon: BarChart2,
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/25",
        badge: "Анализатор CTR",
        title: "Оцените и улучшите существующие объявления",
        desc: "Вставьте любое объявление и получите разбивку по 5 измерениям CTR. AI определяет, что снижает эффективность, и предоставляет конкретные переработки — без размытых советов.",
        bullets: [
          "5 измерений: Сила заголовка, CTA, Релевантность, Эмоциональный отклик, Уникальность",
          "Взвешенный общий балл CTR 0–100",
          "3–7 конкретных, действенных рекомендаций",
          "3 улучшенных примера заголовков (≤30 символов)",
          "1 улучшенное описание (≤90 символов)",
          "Статус: Отлично / Хорошо / Средне / Требует работы",
          "Отраслевой анализ с контекстом ключевых слов",
        ],
        href: "/dashboard/ctr-analyzer",
      },
    ],
    statsLabel: "Статистика платформы",
    stats: [
      { value: "15+", label: "Поддерживаемых языков" },
      { value: "30+", label: "Целевых стран" },
      { value: "8",   label: "Категорий модерации" },
      { value: "5",   label: "Измерений CTR" },
    ],
    compLabel: "Сравнение с альтернативами",
    compFeatures: [
      ["15 RSA заголовков + 4 описания",           true, false, false],
      ["Предварительная проверка политики",         true, false, false],
      ["Оценка CTR по измерениям",                  true, false, false],
      ["Валидация количества символов",             true, true,  false],
      ["Поддержка русского языка и СНГ",            true, false, false],
      ["Оценка силы каждого элемента",              true, false, false],
      ["AI-сгенерированные безопасные замены",      true, false, false],
      ["API доступ",                                true, true,  true ],
    ],
    compCols: ["AdPilot AI", "Обычные AI-писатели", "Ручной копирайтинг"],
    principlesLabel: "Построено на правильных принципах",
    principles: [
      { icon: Lock,   title: "Политика прежде всего", desc: "Каждая генерация проходит через наш движок соответствия перед выдачей." },
      { icon: Globe,  title: "Поддержка глобальных рынков", desc: "Нативная обработка СНГ-языков, а не просто переведённые западные тексты." },
      { icon: Brain,  title: "OpenAI GPT-4o mini", desc: "Серверные API-вызовы — ваш ключ остаётся конфиденциальным." },
      { icon: Cpu,    title: "Резервный движок", desc: "Движок на основе правил мгновенно активируется при недоступности AI." },
      { icon: Layers, title: "REST API готов",   desc: "Каждый инструмент доступен как JSON API-эндпоинт для ваших интеграций." },
      { icon: Target, title: "Целеориентированные тексты", desc: "Объявления написаны под вашу цель: лиды, продажи, охват или установки." },
    ],
    ctaLabel: "Готовы начать?",
    ctaDesc: "Создайте первое RSA-объявление менее чем за 60 секунд. Без кредитной карты.",
  },
};

export default function FeaturesPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
              <Zap className="w-3 h-3 text-indigo-400" fill="currentColor" />
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 tracking-tight leading-none">
              {c.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                {c.headlineGradient}
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8 leading-relaxed">{c.subtitle}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/register">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  {c.ctaMain} <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 font-medium text-sm transition-all">
                {c.ctaSub}
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
          >
            {c.stats.map((stat, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-center">
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/35 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Tool deep-dives */}
          <div className="space-y-8 mb-20">
            {c.tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.badge}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                >
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg ${tool.shadow}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent border border-white/[0.08]`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-white mb-3 leading-snug">{tool.title}</h2>
                      <p className="text-white/45 leading-relaxed mb-6">{tool.desc}</p>
                      <Link href={tool.href}>
                        <motion.span
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-semibold text-sm shadow-lg ${tool.shadow} transition-all cursor-pointer`}
                        >
                          Try it now <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </Link>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                      <ul className="space-y-2.5">
                        {tool.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white/60 leading-snug">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.compLabel}</h2>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-6 py-4 text-left text-xs text-white/25 font-medium w-1/2" />
                      {c.compCols.map((col, i) => (
                        <th key={col} className="px-6 py-4 text-center text-xs font-bold">
                          <span className={i === 0 ? "text-indigo-400" : "text-white/30"}>{col}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {c.compFeatures.map(([label, ...vals]) => (
                      <tr key={String(label)} className="hover:bg-white/[0.015] transition-colors">
                        <td className="px-6 py-3.5 text-sm text-white/55">{label}</td>
                        {(vals as boolean[]).map((v, i) => (
                          <td key={i} className="px-6 py-3.5 text-center">
                            {v ? (
                              <Check className={`w-4 h-4 mx-auto ${i === 0 ? "text-emerald-400" : "text-white/25"}`} />
                            ) : (
                              <span className="block w-4 h-px bg-white/[0.1] mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.principlesLabel}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.principles.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1.5">{p.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.06] p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <h2 className="text-3xl font-black text-white mb-3">{c.ctaLabel}</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">{c.ctaDesc}</p>
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                {c.ctaMain} <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
