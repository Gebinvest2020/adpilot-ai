"use client";

import { motion } from "framer-motion";
import { Download, Mail, ExternalLink, FileText, Image, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    badge: "Press Kit",
    headline: "Media resources for",
    headlineGradient: "AdPilot AI",
    subtitle: "Everything journalists, bloggers, and partners need to write about AdPilot AI accurately.",
    factsLabel: "Quick facts",
    facts: [
      ["Founded", "2023"],
      ["Headquarters", "Remote-first (CIS & EU)"],
      ["Team size", "12 people"],
      ["Funding", "Seed — $2.1M"],
      ["Users", "50,000+"],
      ["Countries", "30+"],
      ["Category", "AI-Powered PPC / Google Ads Automation"],
      ["Tagline", "Google Ads copy at AI speed, policy-first quality"],
    ],
    assetsLabel: "Brand assets",
    assets: [
      { icon: Image,    title: "Logo Pack",         desc: "SVG + PNG in light/dark variants, with and without wordmark", size: "ZIP · 2.4 MB" },
      { icon: FileText, title: "Brand Guidelines",  desc: "Colors, typography, logo usage rules, and what not to do",   size: "PDF · 1.1 MB" },
      { icon: Image,    title: "Product Screenshots", desc: "High-res screenshots of RSA Generator, Moderation Checker, CTR Analyzer", size: "ZIP · 8.6 MB" },
      { icon: FileText, title: "One-pager",          desc: "Single-page overview of the product for press packages",     size: "PDF · 0.8 MB" },
    ],
    mentionsLabel: "In the press",
    mentions: [
      { pub: "PPC Hero",       title: "10 AI Tools Redefining Google Ads in 2025",         date: "Jan 2025" },
      { pub: "Search Engine Land", title: "The Rise of Policy-First AI Ad Copy",           date: "Dec 2024" },
      { pub: "MarketingProfs",  title: "AdPilot AI Review: Does AI-Generated Copy Convert?", date: "Nov 2024" },
      { pub: "RuNet PPC Blog",  title: "Лучшие AI-инструменты для Google Ads в СНГ",        date: "Oct 2024" },
    ],
    contactLabel: "Press contact",
    contactDesc: "For interview requests, product demonstrations, or press inquiries, contact our communications team.",
    emailLabel: "Email",
    responseLabel: "Response time",
    responseTime: "Within 24 hours",
    downloadBtn: "Download",
  },
  ru: {
    badge: "Пресс-кит",
    headline: "Медиаресурсы",
    headlineGradient: "AdPilot AI",
    subtitle: "Всё необходимое для журналистов, блогеров и партнёров, чтобы точно писать об AdPilot AI.",
    factsLabel: "Ключевые факты",
    facts: [
      ["Основан", "2023"],
      ["Штаб-квартира", "Удалённая (СНГ и ЕС)"],
      ["Команда", "12 человек"],
      ["Финансирование", "Seed — $2.1M"],
      ["Пользователей", "50 000+"],
      ["Стран", "30+"],
      ["Категория", "AI-автоматизация Google Ads"],
      ["Слоган", "Тексты Google Ads со скоростью AI, качество — политика прежде всего"],
    ],
    assetsLabel: "Бренд-ресурсы",
    assets: [
      { icon: Image,    title: "Пакет логотипов",     desc: "SVG + PNG в светлом/тёмном вариантах, с символом и без", size: "ZIP · 2.4 МБ" },
      { icon: FileText, title: "Гайдлайн бренда",     desc: "Цвета, типографика, правила использования логотипа",     size: "PDF · 1.1 МБ" },
      { icon: Image,    title: "Скриншоты продукта",  desc: "Скриншоты высокого разрешения RSA-генератора, модерации и анализатора CTR", size: "ZIP · 8.6 МБ" },
      { icon: FileText, title: "Одностраничник",       desc: "Краткий обзор продукта для пресс-пакетов",               size: "PDF · 0.8 МБ" },
    ],
    mentionsLabel: "В прессе",
    mentions: [
      { pub: "PPC Hero",        title: "10 AI-инструментов, меняющих Google Ads в 2025",   date: "Янв. 2025" },
      { pub: "Search Engine Land", title: "Рост AI-копирайтинга с приоритетом политики",   date: "Дек. 2024" },
      { pub: "MarketingProfs",  title: "AdPilot AI: конвертируют ли AI-тексты?",          date: "Ноя. 2024" },
      { pub: "RuNet PPC Blog",  title: "Лучшие AI-инструменты для Google Ads в СНГ",       date: "Окт. 2024" },
    ],
    contactLabel: "Контакт для прессы",
    contactDesc: "Для запросов на интервью, демонстраций продукта или пресс-запросов свяжитесь с нашей командой по коммуникациям.",
    emailLabel: "Email",
    responseLabel: "Время ответа",
    responseTime: "В течение 24 часов",
    downloadBtn: "Скачать",
  },
};

export default function PressPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/8 mb-6">
              <FileText className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {c.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">{c.headlineGradient}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">{c.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Facts */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{c.factsLabel}</p>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                  {c.facts.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-white/40">{label}</span>
                      <span className="text-sm font-semibold text-white/80">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Brand assets */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{c.assetsLabel}</p>
                <div className="space-y-3">
                  {c.assets.map((asset, i) => {
                    const Icon = asset.icon;
                    return (
                      <motion.div key={asset.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">{asset.title}</p>
                          <p className="text-xs text-white/35 leading-snug mt-0.5">{asset.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-white/25 font-mono">{asset.size}</span>
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-blue-500/15 group-hover:border-blue-500/20 transition-all">
                            <Download className="w-3.5 h-3.5 text-white/35 group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Mentions */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{c.mentionsLabel}</p>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
                  {c.mentions.map((m) => (
                    <div key={m.title} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <div className="w-24 flex-shrink-0">
                        <p className="text-[10px] font-bold text-indigo-400/70">{m.pub}</p>
                      </div>
                      <p className="text-sm text-white/60 flex-1 group-hover:text-white/80 transition-colors leading-snug">{m.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-white/25">{m.date}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">

              {/* Logo preview */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Zap className="w-5 h-5 text-white" fill="white" />
                  </div>
                  <span className="text-xl font-black">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot</span>
                    <span className="text-white/40 text-sm font-normal ml-0.5">AI</span>
                  </span>
                </div>
                <p className="text-xs text-white/25 mb-3">Primary logo — dark background</p>
                <div className="h-12 bg-white rounded-xl flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" fill="white" />
                  </div>
                  <span className="text-base font-black text-gray-900">AdPilot <span className="text-gray-400 font-normal text-sm">AI</span></span>
                </div>
                <p className="text-xs text-white/25">Primary logo — light background</p>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <p className="text-sm font-bold text-white mb-4">{c.contactLabel}</p>
                <p className="text-xs text-white/40 leading-relaxed mb-4">{c.contactDesc}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">{c.emailLabel}</p>
                    <a href="mailto:press@adpilot.ai" className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      press@adpilot.ai
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">{c.responseLabel}</p>
                    <p className="text-sm text-white/55">{c.responseTime}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
