"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Shield, BarChart2, Key, Webhook, Zap, Terminal, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    badge: "Documentation",
    headline: "Build with",
    headlineGradient: "AdPilot AI",
    subtitle: "Everything you need to integrate AdPilot AI into your workflows — from quick-start guides to full API reference.",
    searchPlaceholder: "Search documentation...",
    quickStartLabel: "Quick Start",
    browseLabel: "Browse Documentation",
    whatsNewLabel: "What's New",
    changelogLink: "Full changelog",
    categories: [
      {
        title: "Getting Started",
        desc: "Set up your account, generate your first RSA ad, and understand how the platform works.",
        href: "/docs",
        color: "from-indigo-500 to-violet-600",
        glow: "shadow-indigo-500/20",
        time: "5 min read",
      },
      {
        title: "RSA Generator API",
        desc: "Generate 15 headlines + 4 descriptions programmatically. Full request/response schema.",
        href: "/docs/api",
        color: "from-violet-500 to-purple-600",
        glow: "shadow-violet-500/20",
        time: "10 min read",
      },
      {
        title: "Moderation API",
        desc: "Pre-screen ad copy for Google policy violations before submission. Risk scoring and flags.",
        href: "/docs/api",
        color: "from-emerald-500 to-cyan-600",
        glow: "shadow-emerald-500/20",
        time: "8 min read",
      },
      {
        title: "CTR Analyzer API",
        desc: "Score your existing ad copy and get AI-powered improvement suggestions.",
        href: "/docs/api",
        color: "from-cyan-500 to-blue-600",
        glow: "shadow-cyan-500/20",
        time: "6 min read",
      },
      {
        title: "Authentication",
        desc: "API key management, rate limits, and how to authenticate every request securely.",
        href: "/docs/api",
        color: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/20",
        time: "4 min read",
      },
      {
        title: "Webhooks",
        desc: "Receive real-time notifications for async jobs, generation completions, and account events.",
        href: "/docs/api",
        color: "from-rose-500 to-pink-600",
        glow: "shadow-rose-500/20",
        time: "7 min read",
      },
    ],
    changelog: [
      { version: "v2.4.0", date: "Jan 12, 2025", desc: "GPT-5 integration — faster generation, improved CIS-market copy quality, 15% lower latency." },
      { version: "v2.3.0", date: "Dec 20, 2024", desc: "New CIS country selector with 13 regions. Russian language output fully optimized." },
      { version: "v2.2.1", date: "Dec 5, 2024",  desc: "Bug fixes: moderation score calculation for Cyrillic text, API rate limit headers." },
    ],
  },
  ru: {
    badge: "Документация",
    headline: "Создавайте с",
    headlineGradient: "AdPilot AI",
    subtitle: "Всё необходимое для интеграции AdPilot AI в ваши рабочие процессы — от руководств по быстрому старту до полного API Reference.",
    searchPlaceholder: "Поиск по документации...",
    quickStartLabel: "Быстрый старт",
    browseLabel: "Разделы документации",
    whatsNewLabel: "Что нового",
    changelogLink: "Полный журнал изменений",
    categories: [
      {
        title: "Быстрый старт",
        desc: "Создайте аккаунт, сгенерируйте первое RSA-объявление и разберитесь в работе платформы.",
        href: "/docs",
        color: "from-indigo-500 to-violet-600",
        glow: "shadow-indigo-500/20",
        time: "5 мин",
      },
      {
        title: "API RSA Генератора",
        desc: "Программная генерация 15 заголовков + 4 описаний. Полная схема запросов и ответов.",
        href: "/docs/api",
        color: "from-violet-500 to-purple-600",
        glow: "shadow-violet-500/20",
        time: "10 мин",
      },
      {
        title: "API Модерации",
        desc: "Проверяйте тексты объявлений на нарушения политики Google до отправки. Оценка рисков и флаги.",
        href: "/docs/api",
        color: "from-emerald-500 to-cyan-600",
        glow: "shadow-emerald-500/20",
        time: "8 мин",
      },
      {
        title: "API Анализатора CTR",
        desc: "Оценивайте существующие объявления и получайте AI-рекомендации по улучшению.",
        href: "/docs/api",
        color: "from-cyan-500 to-blue-600",
        glow: "shadow-cyan-500/20",
        time: "6 мин",
      },
      {
        title: "Аутентификация",
        desc: "Управление API-ключами, лимиты запросов и безопасная аутентификация каждого запроса.",
        href: "/docs/api",
        color: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/20",
        time: "4 мин",
      },
      {
        title: "Вебхуки",
        desc: "Получайте уведомления в реальном времени о выполнении задач, генерации и событиях аккаунта.",
        href: "/docs/api",
        color: "from-rose-500 to-pink-600",
        glow: "shadow-rose-500/20",
        time: "7 мин",
      },
    ],
    changelog: [
      { version: "v2.4.0", date: "12 янв. 2025", desc: "Интеграция GPT-5 — более быстрая генерация, улучшенное качество текстов для СНГ-рынка, латентность снижена на 15%." },
      { version: "v2.3.0", date: "20 дек. 2024", desc: "Новый выбор стран СНГ с 13 регионами. Полная оптимизация русскоязычного вывода." },
      { version: "v2.2.1", date: "5 дек. 2024",  desc: "Исправления: расчёт оценки модерации для кириллического текста, заголовки лимитов API." },
    ],
  },
};

const CAT_ICONS = [Zap, Code2, Shield, BarChart2, Key, Webhook];

export default function DocsPage() {
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
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {c.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                {c.headlineGradient}
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
              {c.subtitle}
            </p>

            {/* Search (decorative) */}
            <div className="max-w-md mx-auto relative">
              <div className="relative flex items-center px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.03]">
                <BookOpen className="w-4 h-4 text-white/25 mr-3 flex-shrink-0" />
                <span className="text-sm text-white/25">{c.searchPlaceholder}</span>
                <span className="ml-auto text-xs text-white/20 border border-white/[0.08] px-1.5 py-0.5 rounded font-mono">⌘K</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Start code block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0d0d14] overflow-hidden mb-14"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white/45 uppercase tracking-widest">{c.quickStartLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  <span className="text-white/30"># Generate RSA ad copy via REST API{"\n"}</span>
                  <span className="text-cyan-400">curl</span>
                  <span className="text-white/60"> -X </span>
                  <span className="text-emerald-400">POST</span>
                  <span className="text-white/60"> https://api.adpilot.ai/v1/rsa/generate \{"\n"}</span>
                  <span className="text-white/60">  -H </span>
                  <span className="text-amber-300">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span>
                  <span className="text-white/60"> \{"\n"}</span>
                  <span className="text-white/60">  -H </span>
                  <span className="text-amber-300">&quot;Content-Type: application/json&quot;</span>
                  <span className="text-white/60"> \{"\n"}</span>
                  <span className="text-white/60">  -d </span>
                  <span className="text-amber-300">{"'{"}</span>
                  <span className="text-white/60">{"\n"}    </span>
                  <span className="text-indigo-300">&quot;niche&quot;</span>
                  <span className="text-white/60">: </span>
                  <span className="text-emerald-400">&quot;SaaS PPC management agency&quot;</span>
                  <span className="text-white/60">,{"\n"}    </span>
                  <span className="text-indigo-300">&quot;language&quot;</span>
                  <span className="text-white/60">: </span>
                  <span className="text-emerald-400">&quot;en&quot;</span>
                  <span className="text-white/60">,{"\n"}    </span>
                  <span className="text-indigo-300">&quot;country&quot;</span>
                  <span className="text-white/60">: </span>
                  <span className="text-emerald-400">&quot;US&quot;</span>
                  <span className="text-white/60">,{"\n"}    </span>
                  <span className="text-indigo-300">&quot;goal&quot;</span>
                  <span className="text-white/60">: </span>
                  <span className="text-emerald-400">&quot;conversions&quot;</span>
                  <span className="text-white/60">,{"\n"}    </span>
                  <span className="text-indigo-300">&quot;tone&quot;</span>
                  <span className="text-white/60">: </span>
                  <span className="text-emerald-400">&quot;professional&quot;</span>
                  <span className="text-white/60">{"\n"}  </span>
                  <span className="text-amber-300">{"}'"}
                  </span>
                </code>
              </pre>
            </div>
          </motion.div>

          {/* Doc categories */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-bold text-white/25 uppercase tracking-widest mb-6"
            >
              {c.browseLabel}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {c.categories.map((cat, i) => {
                const Icon = CAT_ICONS[i];
                return (
                  <motion.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <Link
                      href={cat.href}
                      className="group flex flex-col h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] p-6 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg ${cat.glow} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">{cat.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed flex-1">{cat.desc}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
                        <span className="text-xs text-white/25">{cat.time}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/25 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Changelog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-white/25 uppercase tracking-widest">{c.whatsNewLabel}</h2>
              <Link href="#" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                {c.changelogLink} <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05] overflow-hidden">
              {c.changelog.map((entry) => (
                <div key={entry.version} className="flex items-start gap-5 p-5">
                  <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg flex-shrink-0 mt-0.5">
                    {entry.version}
                  </span>
                  <div>
                    <p className="text-xs text-white/30 mb-1">{entry.date}</p>
                    <p className="text-sm text-white/60">{entry.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
