"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

const colorMap: Record<string, string> = {
  indigo: "border-indigo-500/20 bg-indigo-500/6 text-indigo-400",
  violet: "border-violet-500/20 bg-violet-500/6 text-violet-400",
  cyan:   "border-cyan-500/20   bg-cyan-500/6   text-cyan-400",
  amber:  "border-amber-500/20  bg-amber-500/6  text-amber-400",
};

const CONTENT = {
  en: {
    backLabel: "Back to home",
    pageTitle: "Cookie Policy",
    lastUpdated: "Last updated: January 15, 2025",
    intro: "This Cookie Policy explains how AdPilot AI uses cookies and similar tracking technologies when you visit our website or use our platform. By continuing to use AdPilot AI, you consent to our use of cookies as described in this policy.",
    contentsLabel: "Contents",
    colHeaders: ["Cookie Name", "Purpose", "Duration"],
    thirdPartyTitle: "Third-Party Cookies",
    thirdPartyDesc: "Some cookies on our platform are set by third-party services we use. These third parties may use cookies to provide their services and may have their own privacy policies:",
    s1Title: "What Are Cookies?",
    s1p1: "Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies can be \"session cookies\" (deleted when you close your browser) or \"persistent cookies\" (remain on your device for a set period).",
    s1p2: "We also use similar technologies such as local storage, session storage, and web beacons that function in a similar way to cookies.",
    s2Title: "How We Use Cookies",
    s2p: "AdPilot AI uses cookies for the following purposes: to keep you signed in, to remember your preferences, to understand how you use our platform, to improve our service, and to deliver relevant advertising. We categorize our cookies as strictly necessary, performance, functional, and marketing.",
    s3Title: "Cookie Details",
    s4Title: "Managing Cookies",
    s4p1: "You can control and manage cookies in several ways:",
    s4items: [
      ["Browser settings", " — Most browsers allow you to view, manage, and delete cookies through their settings. Note that disabling cookies may affect the functionality of our platform, including the ability to stay signed in."],
      ["Analytics opt-out", " — You can opt out of PostHog analytics by adding the Do Not Track header in your browser, or by visiting PostHog's opt-out page."],
      ["Marketing cookies", " — You can opt out of Google Ads tracking via Google's Ads Settings, and Meta pixel tracking via Meta's ad preferences."],
      ["Account settings", " — Logged-in users can manage analytics and marketing cookie preferences in Account Settings → Privacy."],
    ],
    s5Title: "Updates to This Policy",
    s5p: "We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of material changes by posting the updated policy on this page with a new \"Last updated\" date.",
    s5boxTitle: "Questions about cookies?",
    s5boxText: "Contact us at",
    s5support: "support page",
    cookieTable: [
      {
        category: "Strictly Necessary",
        color: "indigo",
        cookies: [
          { name: "ap_session",    purpose: "Authenticates logged-in users and maintains session state",       duration: "Session" },
          { name: "ap_csrf",       purpose: "Prevents cross-site request forgery attacks",                    duration: "Session" },
          { name: "ap_locale",     purpose: "Stores your selected language preference",                        duration: "1 year" },
        ],
      },
      {
        category: "Performance & Analytics",
        color: "violet",
        cookies: [
          { name: "ph_project_token",  purpose: "PostHog analytics — tracks feature usage and page views (anonymized)", duration: "1 year" },
          { name: "ph_distinct_id",    purpose: "PostHog — anonymous identifier for session analytics",                  duration: "1 year" },
          { name: "_vercel_analytics", purpose: "Vercel Web Analytics — aggregated page performance metrics",           duration: "Session" },
        ],
      },
      {
        category: "Functional",
        color: "cyan",
        cookies: [
          { name: "ap_theme",          purpose: "Saves your display preferences",                         duration: "1 year" },
          { name: "ap_tour_complete",  purpose: "Tracks whether you have completed the onboarding tour",  duration: "Persistent" },
          { name: "ap_dismissed",      purpose: "Records which notifications you have dismissed",          duration: "90 days" },
        ],
      },
      {
        category: "Marketing",
        color: "amber",
        cookies: [
          { name: "_fbp",    purpose: "Facebook Pixel — used for ad attribution on Meta platforms",  duration: "3 months" },
          { name: "_gcl_au", purpose: "Google Ads conversion tracking",                               duration: "3 months" },
          { name: "ap_ref",  purpose: "Stores referral source for affiliate attribution",              duration: "30 days" },
        ],
      },
    ],
    thirdParties: [
      ["PostHog", "Product analytics", "posthog.com/privacy"],
      ["Stripe", "Payment processing", "stripe.com/privacy"],
      ["Google Analytics", "Web analytics", "policies.google.com/privacy"],
      ["Meta Pixel", "Ad attribution", "facebook.com/privacy"],
    ],
  },
  ru: {
    backLabel: "На главную",
    pageTitle: "Политика Cookie",
    lastUpdated: "Последнее обновление: 15 января 2025 г.",
    intro: "Настоящая Политика cookie объясняет, как AdPilot AI использует файлы cookie и аналогичные технологии отслеживания при посещении нашего сайта или использовании платформы. Продолжая использовать AdPilot AI, вы соглашаетесь с использованием файлов cookie, описанным в настоящей политике.",
    contentsLabel: "Содержание",
    colHeaders: ["Название cookie", "Назначение", "Срок хранения"],
    thirdPartyTitle: "Сторонние файлы cookie",
    thirdPartyDesc: "Часть файлов cookie на нашей платформе устанавливается сторонними сервисами. Эти третьи стороны могут использовать cookie для предоставления своих услуг и иметь собственные политики конфиденциальности:",
    s1Title: "Что такое файлы cookie?",
    s1p1: "Файлы cookie — это небольшие текстовые файлы, помещаемые на ваше устройство при посещении веб-сайта. Они широко используются для повышения эффективности работы сайтов и предоставления информации их владельцам. Cookie могут быть «сеансовыми» (удаляются при закрытии браузера) или «постоянными» (сохраняются на устройстве в течение заданного периода).",
    s1p2: "Мы также используем аналогичные технологии: локальное хранилище, хранилище сеансов и веб-маяки, которые работают схожим образом.",
    s2Title: "Как мы используем файлы cookie",
    s2p: "AdPilot AI использует cookie в следующих целях: для поддержания авторизации, сохранения ваших предпочтений, анализа использования платформы, улучшения сервиса и показа релевантной рекламы. Мы классифицируем cookie как строго необходимые, аналитические, функциональные и маркетинговые.",
    s3Title: "Описание файлов cookie",
    s4Title: "Управление файлами cookie",
    s4p1: "Вы можете управлять файлами cookie несколькими способами:",
    s4items: [
      ["Настройки браузера", " — Большинство браузеров позволяют просматривать, управлять и удалять cookie через настройки. Обратите внимание, что отключение cookie может повлиять на работу платформы, в том числе на возможность оставаться в системе."],
      ["Отказ от аналитики", " — Вы можете отказаться от аналитики PostHog, включив заголовок Do Not Track в браузере или посетив страницу отказа PostHog."],
      ["Маркетинговые cookie", " — Вы можете отказаться от отслеживания Google Ads через Настройки рекламы Google и от пикселя Meta через настройки рекламы Meta."],
      ["Настройки аккаунта", " — Авторизованные пользователи могут управлять аналитическими и маркетинговыми cookie в разделе Настройки аккаунта → Конфиденциальность."],
    ],
    s5Title: "Обновление настоящей политики",
    s5p: "Мы можем периодически обновлять настоящую Политику cookie для отражения изменений в нашей практике или применимом законодательстве. Мы уведомим вас о существенных изменениях, разместив обновлённую политику на этой странице с новой датой «Последнего обновления».",
    s5boxTitle: "Вопросы о файлах cookie?",
    s5boxText: "Напишите нам на",
    s5support: "странице поддержки",
    cookieTable: [
      {
        category: "Строго необходимые",
        color: "indigo",
        cookies: [
          { name: "ap_session",   purpose: "Аутентификация авторизованных пользователей и поддержание сеанса",    duration: "Сеанс" },
          { name: "ap_csrf",      purpose: "Защита от межсайтовой подделки запросов",                             duration: "Сеанс" },
          { name: "ap_locale",    purpose: "Хранит выбранный вами язык интерфейса",                               duration: "1 год" },
        ],
      },
      {
        category: "Производительность и аналитика",
        color: "violet",
        cookies: [
          { name: "ph_project_token",  purpose: "Аналитика PostHog — отслеживание использования функций и просмотров страниц (анонимно)", duration: "1 год" },
          { name: "ph_distinct_id",    purpose: "PostHog — анонимный идентификатор сеанса для аналитики",                                  duration: "1 год" },
          { name: "_vercel_analytics", purpose: "Vercel Web Analytics — агрегированные метрики производительности страниц",               duration: "Сеанс" },
        ],
      },
      {
        category: "Функциональные",
        color: "cyan",
        cookies: [
          { name: "ap_theme",         purpose: "Сохраняет ваши настройки отображения",                              duration: "1 год" },
          { name: "ap_tour_complete", purpose: "Фиксирует, завершили ли вы обучающий тур",                          duration: "Постоянный" },
          { name: "ap_dismissed",     purpose: "Сохраняет, какие уведомления вы скрыли",                            duration: "90 дней" },
        ],
      },
      {
        category: "Маркетинговые",
        color: "amber",
        cookies: [
          { name: "_fbp",    purpose: "Facebook Pixel — атрибуция рекламы на платформах Meta",  duration: "3 месяца" },
          { name: "_gcl_au", purpose: "Отслеживание конверсий Google Ads",                       duration: "3 месяца" },
          { name: "ap_ref",  purpose: "Хранит источник перехода для партнёрской атрибуции",       duration: "30 дней" },
        ],
      },
    ],
    thirdParties: [
      ["PostHog", "Продуктовая аналитика", "posthog.com/privacy"],
      ["Stripe", "Обработка платежей", "stripe.com/privacy"],
      ["Google Analytics", "Веб-аналитика", "policies.google.com/privacy"],
      ["Meta Pixel", "Атрибуция рекламы", "facebook.com/privacy"],
    ],
  },
};

export default function CookiesPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {c.backLabel}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">{c.pageTitle}</h1>
                <p className="text-sm text-white/35">{c.lastUpdated}</p>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed">{c.intro}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-10 text-white/60 text-sm leading-relaxed"
          >

            <section>
              <h2 className="text-xl font-bold text-white mb-3">{c.s1Title}</h2>
              <p className="mb-3">{c.s1p1}</p>
              <p>{c.s1p2}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">{c.s2Title}</h2>
              <p>{c.s2p}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">{c.s3Title}</h2>
              <div className="space-y-6">
                {c.cookieTable.map((group) => (
                  <div key={group.category}>
                    <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-3", colorMap[group.color])}>
                      {group.category}
                    </div>
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                      <div className="grid grid-cols-3 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                        {c.colHeaders.map((h) => (
                          <span key={h} className="text-xs font-bold text-white/35 uppercase tracking-widest">{h}</span>
                        ))}
                      </div>
                      {group.cookies.map((ck, i) => (
                        <div
                          key={ck.name}
                          className={cn(
                            "grid grid-cols-3 px-4 py-3 gap-3",
                            i < group.cookies.length - 1 && "border-b border-white/[0.04]"
                          )}
                        >
                          <span className="text-xs font-mono text-white/70">{ck.name}</span>
                          <span className="text-xs text-white/45">{ck.purpose}</span>
                          <span className="text-xs text-white/45">{ck.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">{c.s4Title}</h2>
              <p className="mb-3">{c.s4p1}</p>
              <ul className="space-y-2 ml-4 list-disc marker:text-white/20 mb-4">
                {c.s4items.map(([bold, text]) => (
                  <li key={bold}><strong className="text-white/75">{bold}</strong>{text}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">{c.thirdPartyTitle}</h2>
              <p className="mb-3">{c.thirdPartyDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.thirdParties.map(([name, purpose, policy]) => (
                  <div key={name} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <p className="text-xs font-bold text-white/70">{name}</p>
                    <p className="text-xs text-white/40 mb-1">{purpose}</p>
                    <p className="text-xs text-indigo-400/70 font-mono">{policy}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">{c.s5Title}</h2>
              <p className="mb-4">{c.s5p}</p>
              <div className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <p className="font-semibold text-white/70 mb-1">{c.s5boxTitle}</p>
                <p>
                  {c.s5boxText} <a href="mailto:privacy@adpilot.ai" className="text-indigo-400 hover:text-indigo-300">privacy@adpilot.ai</a>
                  {locale === "ru" ? " или посетите нашу " : " or visit our "}
                  <Link href="/support" className="text-indigo-400 hover:text-indigo-300">{c.s5support}</Link>.
                </p>
              </div>
            </section>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
