"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useT, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FaqCategory = "general" | "billing" | "technical" | "account";
interface FaqItem { id: string; q: string; a: string; cat: FaqCategory }

const FAQS: Record<string, FaqItem[]> = {
  en: [
    { id: "e1", cat: "general",   q: "What is AdPilot AI?",                                        a: "AdPilot AI is an AI-powered Google Ads platform that generates high-converting Responsive Search Ads (RSAs), checks ads for moderation compliance, and analyzes CTR performance. It uses GPT-5 and Claude to create ad copy tailored to your niche, target audience, and campaign goals in seconds." },
    { id: "e2", cat: "general",   q: "How is AdPilot AI different from other ad generators?",      a: "Most tools give you generic copy. AdPilot AI combines two leading AI models (GPT-5 + Claude), applies Google Ads best practices, runs a moderation pre-screen before you submit, and scores every headline and description by predicted CTR. You get 15 headlines + 4 descriptions with individual quality tips, not just a wall of text." },
    { id: "e3", cat: "general",   q: "Do I need to know Google Ads to use AdPilot AI?",            a: "No expertise is required. You describe your business, select a campaign goal and tone, and the AI does the rest. That said, AdPilot AI is also loved by experienced PPC professionals for its speed, CIS-market support, and detailed strength scoring." },
    { id: "e4", cat: "billing",   q: "Is there a free trial?",                                     a: "Yes. All new accounts include a 14-day free trial with full Growth plan features — 500 AI-generated ads, advanced moderation, CTR analysis, and keyword intelligence. No credit card is required to start." },
    { id: "e5", cat: "billing",   q: "Can I change or cancel my plan?",                            a: "You can upgrade, downgrade, or cancel your subscription at any time from your account settings. Upgrades take effect immediately (prorated). Downgrades and cancellations take effect at the end of your current billing period. We offer a 7-day money-back guarantee on first-time paid subscriptions." },
    { id: "e6", cat: "billing",   q: "Do you offer discounts for agencies or teams?",              a: "Yes. The Growth plan includes 5 seats and white-label exports, making it ideal for agencies. The Enterprise plan has unlimited seats and a custom pricing option for large teams. Contact our sales team at sales@adpilot.ai to discuss your needs." },
    { id: "e7", cat: "technical", q: "Which languages does AdPilot AI support?",                   a: "AdPilot AI supports 16 languages including English, Russian, Spanish, French, German, Portuguese, Italian, Dutch, Japanese, Korean, Chinese (Simplified), Arabic, Polish, Swedish, Norwegian, and Danish. Russian is fully supported with CIS-market-optimized copy — not just translations." },
    { id: "e8", cat: "technical", q: "How accurate is the moderation checker?",                    a: "Our moderation checker flags the most common Google Ads policy violations — superlative claims, restricted industries, trademark issues, excessive punctuation, and prohibited content. It has a ~94% detection rate based on internal testing against 50,000+ disapproved ads. It is a pre-screening tool, not a guarantee of approval." },
    { id: "e9", cat: "technical", q: "Is there an API?",                                           a: "Yes. Growth and Enterprise plans include REST API access. The API lets you programmatically generate RSAs, run moderation checks, and retrieve CTR scores. Full documentation is available at /docs/api. The Growth plan includes 1,000 API calls/month; Enterprise is unlimited." },
    { id: "e10", cat: "account",  q: "How do I reset my password?",                                a: "Go to the login page and click 'Forgot password'. Enter your email address and we'll send a reset link within 2 minutes. If you don't receive it, check your spam folder or contact support@adpilot.ai." },
    { id: "e11", cat: "account",  q: "Can I export my generated ads?",                             a: "Yes. All plans support export to CSV and JSON. Growth and Enterprise plans additionally support white-label PDF exports suitable for client presentations. You can also copy individual headlines, descriptions, or CTA suggestions with one click directly from the generator." },
    { id: "e12", cat: "account",  q: "How do I invite team members?",                              a: "From your dashboard, go to Settings → Team. Enter your team member's email address and select their role (Admin, Editor, or Viewer). Growth plan includes 5 seats; Enterprise is unlimited. Team members receive an email invitation to join your workspace." },
  ],
  ru: [
    { id: "r1", cat: "general",   q: "Что такое AdPilot AI?",                                              a: "AdPilot AI — это AI-платформа для создания высококонверсионной рекламы в Google. Сервис генерирует RSA-объявления (Responsive Search Ads), проверяет их на соответствие политике Google перед публикацией и анализирует CTR. Для генерации текстов используются модели GPT-5 и Claude." },
    { id: "r2", cat: "general",   q: "Чем AdPilot AI отличается от других генераторов?",                  a: "Большинство инструментов дают шаблонные тексты. AdPilot AI использует связку двух мощных моделей (GPT-5 + Claude), применяет реальные best practices Google Ads, автоматически проверяет объявления на нарушения политики ещё до отправки и выставляет оценку каждому заголовку по предполагаемому CTR. В итоге вы получаете 15 заголовков + 4 описания с персональными рекомендациями для каждого." },
    { id: "r3", cat: "general",   q: "Нужно ли знать Google Ads, чтобы пользоваться сервисом?",           a: "Нет. Достаточно описать свой бизнес, выбрать цель и тон кампании — AI сделает остальное. При этом AdPilot AI пользуются и профессиональные PPC-специалисты: им нравятся скорость, поддержка русского языка и детальная оценка качества каждого объявления." },
    { id: "r4", cat: "billing",   q: "Есть ли бесплатный пробный период?",                               a: "Да. Все новые аккаунты получают 14 дней бесплатного доступа с полным набором функций тарифа «Рост» — 500 объявлений, расширенная проверка модерации, анализ CTR и подбор ключевых слов. Привязка карты не нужна." },
    { id: "r5", cat: "billing",   q: "Можно ли изменить или отменить тариф?",                             a: "Да, в любой момент через настройки аккаунта. Повышение тарифа вступает в силу сразу (оплата пересчитывается пропорционально). Понижение и отмена — с начала следующего расчётного периода. На первую платную подписку действует возврат в течение 7 дней." },
    { id: "r6", cat: "billing",   q: "Есть ли скидки для агентств?",                                      a: "Да. Тариф «Рост» включает 5 пользователей и white-label экспорт — идеально для агентств. В «Энтерпрайз» нет лимитов на пользователей и возможна индивидуальная цена для крупных команд. Пишите на sales@adpilot.ai." },
    { id: "r7", cat: "technical", q: "Какие языки поддерживаются?",                                       a: "AdPilot AI поддерживает 16 языков, включая русский, английский, испанский, французский, немецкий, португальский, итальянский, нидерландский, японский, корейский, китайский (упрощённый), арабский, польский, шведский, норвежский и датский. Русский язык поддерживается полностью — генерируются нативные тексты в стиле CIS-рынка, а не дословный перевод с английского." },
    { id: "r8", cat: "technical", q: "Насколько точна проверка модерации?",                               a: "Проверка модерации выявляет наиболее частые нарушения политики Google Ads: суперлативные заявления, запрещённые товары и услуги, нарушения торговых марок, избыточную пунктуацию и запрещённый контент. По результатам внутреннего тестирования на 50 000+ отклонённых объявлений — точность около 94%. Проверка является инструментом предварительного скрининга, но не гарантирует одобрение Google." },
    { id: "r9", cat: "technical", q: "Есть ли API?",                                                       a: "Да. API доступен на тарифах «Рост» и «Энтерпрайз». Через REST API можно программно генерировать RSA-объявления, запускать проверку модерации и получать CTR-оценки. Полная документация доступна на /docs/api. Тариф «Рост» — 1 000 запросов/мес., «Энтерпрайз» — безлимит." },
    { id: "r10", cat: "account",  q: "Как сбросить пароль?",                                               a: "На странице входа нажмите «Забыли пароль». Введите свой email — ссылка для сброса придёт в течение 2 минут. Если письма нет — проверьте папку «Спам» или напишите на support@adpilot.ai." },
    { id: "r11", cat: "account",  q: "Можно ли экспортировать сгенерированные объявления?",               a: "Да. Все тарифы поддерживают экспорт в CSV и JSON. Тарифы «Рост» и «Энтерпрайз» дополнительно поддерживают white-label PDF для клиентских презентаций. Также можно скопировать любой заголовок, описание или вариант CTA в один клик прямо в генераторе." },
    { id: "r12", cat: "account",  q: "Как пригласить коллег в команду?",                                   a: "В дашборде перейдите в Настройки → Команда. Введите email коллеги и выберите роль: Администратор, Редактор или Наблюдатель. Тариф «Рост» — до 5 человек, «Энтерпрайз» — без ограничений. Коллега получит приглашение на email." },
  ],
};

export default function FaqPage() {
  const t = useT();
  const { locale } = useLocale();
  const f = t.faq;
  const items = FAQS[locale] ?? FAQS.en;

  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");

  const categories: { key: FaqCategory | "all"; label: string }[] = [
    { key: "all",       label: f.allCategory },
    { key: "general",   label: f.categories.general },
    { key: "billing",   label: f.categories.billing },
    { key: "technical", label: f.categories.technical },
    { key: "account",   label: f.categories.account },
  ];

  const filtered = activeCategory === "all"
    ? items
    : items.filter((i) => i.cat === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 mb-6">
              <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">{f.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {f.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                {f.headlineGradient}
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">{f.subtitle}</p>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                  activeCategory === key
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-white/[0.03] text-white/45 border-white/[0.07] hover:text-white/70 hover:border-white/[0.12]"
                )}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* FAQ list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <p className="text-center text-white/30 py-12">{f.noResults}</p>
            ) : (
              filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm font-semibold text-white/85 leading-snug pr-2">{item.q}</span>
                    <motion.div
                      animate={{ rotate: openId === item.id ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/[0.05] pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.contactTitle}</h3>
              <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">{f.contactSubtitle}</p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                {f.contactBtn}
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
