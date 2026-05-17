"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Briefcase, Heart, Zap, Globe, TrendingUp, Coffee, Laptop } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    badge: "Careers",
    headline: "Help us build the",
    headlineGradient: "future of AI advertising",
    subtitle: "We're a small team solving a hard problem. If you care about AI, PPC, and shipping software that marketers actually use — let's talk.",
    openLabel: "Open positions",
    jobs: [
      {
        title: "Senior AI/ML Engineer",
        team: "Engineering",
        type: "Full-time",
        location: "Remote (CIS / EU)",
        grad: "from-indigo-500 to-violet-600",
        desc: "Own the AI pipeline: prompt engineering, model evaluation, and integrations with OpenAI & Anthropic APIs. You'll make our generations faster and more accurate.",
        skills: ["Python", "LLM APIs", "Prompt engineering", "TypeScript"],
      },
      {
        title: "Senior PPC Strategist",
        team: "Product",
        type: "Full-time",
        location: "Remote (any timezone)",
        grad: "from-emerald-500 to-cyan-600",
        desc: "Translate Google Ads expertise into product features. Write the rules that drive our moderation engine. Be the voice of the practitioner in every product decision.",
        skills: ["Google Ads certified", "Russian + English", "RSA strategy", "Data analysis"],
      },
      {
        title: "Full-Stack Engineer (Next.js)",
        team: "Engineering",
        type: "Full-time",
        location: "Remote (CIS preferred)",
        grad: "from-blue-500 to-indigo-600",
        desc: "Build the product that marketers use every day. Own frontend features end-to-end: from Figma designs to deployed Next.js components and API routes.",
        skills: ["Next.js 14+", "TypeScript", "Tailwind CSS", "React"],
      },
    ],
    benefitsLabel: "Why join us",
    benefits: [
      { icon: Heart,     title: "Meaningful work",       desc: "You'll see your code helping real businesses win in Google Ads." },
      { icon: Globe,     title: "Fully remote",          desc: "Work from anywhere. We don't believe in mandatory offices." },
      { icon: Zap,       title: "Fast shipping culture", desc: "We deploy daily. No 6-month roadmaps before you see impact." },
      { icon: TrendingUp, title: "Equity",              desc: "Everyone on the team has skin in the game." },
      { icon: Coffee,    title: "No bureaucracy",        desc: "Small team, flat structure. Your ideas reach the founders in hours." },
      { icon: Laptop,    title: "Equipment budget",      desc: "$2,000 equipment budget. Use what makes you productive." },
    ],
    processLabel: "Our hiring process",
    processSteps: [
      { step: "01", title: "Apply",            desc: "Send your CV + a short note on why you care about AI and advertising." },
      { step: "02", title: "Intro call",        desc: "30-minute video call with one of the founders. No trick questions." },
      { step: "03", title: "Technical screen", desc: "A paid (3–4 hour) take-home task relevant to the actual job." },
      { step: "04", title: "Offer",             desc: "We move fast. Decision within 48 hours of the final interview." },
    ],
    applyLabel: "Don't see a match?",
    applyDesc: "We hire for talent, not job descriptions. If you're exceptional at something that could make AdPilot AI better, reach out.",
    applyBtn: "Send us a note",
  },
  ru: {
    badge: "Вакансии",
    headline: "Помогите нам построить",
    headlineGradient: "будущее AI-рекламы",
    subtitle: "Мы небольшая команда, решающая сложную проблему. Если вас интересуют AI, PPC и разработка ПО, которым маркетологи реально пользуются — давайте поговорим.",
    openLabel: "Открытые вакансии",
    jobs: [
      {
        title: "Старший AI/ML-инженер",
        team: "Разработка",
        type: "Полная занятость",
        location: "Удалённо (СНГ / ЕС)",
        grad: "from-indigo-500 to-violet-600",
        desc: "Владейте AI-пайплайном: промпт-инжиниринг, оценка моделей и интеграции с API OpenAI и Anthropic. Вы сделаете наши генерации быстрее и точнее.",
        skills: ["Python", "LLM API", "Prompt engineering", "TypeScript"],
      },
      {
        title: "Старший PPC-стратег",
        team: "Продукт",
        type: "Полная занятость",
        location: "Удалённо (любой часовой пояс)",
        grad: "from-emerald-500 to-cyan-600",
        desc: "Трансформируйте экспертизу Google Ads в функции продукта. Пишите правила для движка модерации. Будьте голосом практика в каждом продуктовом решении.",
        skills: ["Сертификат Google Ads", "Русский + Английский", "RSA-стратегия", "Анализ данных"],
      },
      {
        title: "Фуллстек-разработчик (Next.js)",
        team: "Разработка",
        type: "Полная занятость",
        location: "Удалённо (предпочтительно СНГ)",
        grad: "from-blue-500 to-indigo-600",
        desc: "Создавайте продукт, которым маркетологи пользуются ежедневно. Владейте фронтенд-функциями сквозно: от дизайна до задеплоенных компонентов Next.js.",
        skills: ["Next.js 14+", "TypeScript", "Tailwind CSS", "React"],
      },
    ],
    benefitsLabel: "Почему мы",
    benefits: [
      { icon: Heart,      title: "Значимая работа",         desc: "Вы увидите, как ваш код помогает реальным бизнесам побеждать в Google Ads." },
      { icon: Globe,      title: "Полностью удалённо",      desc: "Работайте откуда угодно. Мы не верим в обязательные офисы." },
      { icon: Zap,        title: "Культура быстрой отгрузки", desc: "Деплоим ежедневно. Никаких полугодовых роадмапов до видимого результата." },
      { icon: TrendingUp, title: "Доля в компании",         desc: "Каждый в команде заинтересован в успехе." },
      { icon: Coffee,     title: "Никакой бюрократии",      desc: "Маленькая команда, плоская структура. Ваши идеи достигают основателей за часы." },
      { icon: Laptop,     title: "Бюджет на оборудование",  desc: "$2,000 на оборудование. Используйте то, что повышает вашу продуктивность." },
    ],
    processLabel: "Процесс найма",
    processSteps: [
      { step: "01", title: "Заявка",          desc: "Пришлите резюме + короткую заметку о том, почему вам важен AI и реклама." },
      { step: "02", title: "Вводный звонок",  desc: "30-минутный видеозвонок с одним из основателей. Без каверзных вопросов." },
      { step: "03", title: "Техническая проверка", desc: "Оплачиваемое (3–4 часа) тестовое задание, реально связанное с работой." },
      { step: "04", title: "Оффер",           desc: "Мы действуем быстро. Решение в течение 48 часов после финального интервью." },
    ],
    applyLabel: "Не нашли подходящую вакансию?",
    applyDesc: "Мы нанимаем за талант, а не по описанию должности. Если вы исключительны в чём-то, что может улучшить AdPilot AI — напишите нам.",
    applyBtn: "Написать нам",
  },
};

export default function CareersPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/8 mb-6">
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {c.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">{c.headlineGradient}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">{c.subtitle}</p>
          </motion.div>

          {/* Jobs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.openLabel}</p>
            <div className="space-y-4">
              {c.jobs.map((job, i) => (
                <motion.div key={job.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.01 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all p-6 cursor-pointer group">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        <span className="text-[10px] font-bold text-white/30 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">{job.team}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/35 mb-3 flex-wrap">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{job.type}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{job.location}</span>
                      </div>
                      <p className="text-sm text-white/45 leading-relaxed mb-4">{job.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((s) => (
                          <span key={s} className="text-[10px] font-bold text-white/45 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.grad} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.benefitsLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div key={b.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{b.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{b.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.processLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.processSteps.map((s, i) => (
                <motion.div key={s.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <p className="text-3xl font-black text-white/10 mb-3 leading-none">{s.step}</p>
                  <p className="text-sm font-bold text-white mb-1.5">{s.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-orange-500/[0.05] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <h2 className="text-2xl font-black text-white mb-2">{c.applyLabel}</h2>
            <p className="text-white/40 mb-6 max-w-md mx-auto">{c.applyDesc}</p>
            <a href="mailto:careers@adpilot.ai">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer">
                {c.applyBtn} <ArrowRight className="w-4 h-4" />
              </motion.span>
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
