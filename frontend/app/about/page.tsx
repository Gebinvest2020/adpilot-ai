"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Globe, Users, TrendingUp, Award, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";

const CONTENT = {
  en: {
    badge: "About Us",
    headline: "Building the future of",
    headlineGradient: "AI-powered advertising",
    subtitle: "AdPilot AI was founded in 2023 with a single mission: make professional Google Ads copywriting accessible to every business, regardless of size or budget.",
    storyLabel: "Our story",
    story: [
      "We started as a team of PPC specialists frustrated by the gap between AI hype and real-world ad performance. Generic AI tools were writing ad copy that sounded clever but violated Google Ads policies, missed character limits, and ignored local market nuances.",
      "So we built AdPilot AI — a platform that combines the speed of generative AI with the specificity of professional PPC knowledge. Every prompt, every validation rule, and every moderation check was written by certified Google Ads specialists.",
      "Today, AdPilot AI serves thousands of marketers across 30+ countries, with particular depth in CIS markets where Russian-language ad copy requires a level of nuance that generic Western tools simply can't deliver.",
    ],
    statsLabel: "By the numbers",
    stats: [
      { value: "2023",  label: "Founded" },
      { value: "30+",   label: "Countries served" },
      { value: "50K+",  label: "Ads generated" },
      { value: "99.2%", label: "Uptime SLA" },
    ],
    teamLabel: "The team",
    team: [
      { name: "Alex Sorokin",    role: "CEO & Co-founder",            initials: "AS", grad: "from-indigo-500 to-violet-600" },
      { name: "Maria Ivanova",   role: "CTO & Co-founder",            initials: "MI", grad: "from-violet-500 to-purple-600" },
      { name: "David Chen",      role: "Head of AI",                  initials: "DC", grad: "from-cyan-500 to-blue-600" },
      { name: "Olga Petrova",    role: "Lead PPC Strategist",         initials: "OP", grad: "from-emerald-500 to-teal-600" },
      { name: "James Wilson",    role: "Head of Product",             initials: "JW", grad: "from-amber-500 to-orange-600" },
      { name: "Anna Kozlova",    role: "Sr. Google Ads Specialist",   initials: "AK", grad: "from-rose-500 to-pink-600" },
    ],
    valuesLabel: "What we believe in",
    values: [
      { icon: Zap,       title: "Speed without sacrificing quality",  desc: "AI generation in seconds, validated by rules honed from thousands of real campaigns." },
      { icon: Globe,     title: "Local-first, global-ready",          desc: "CIS markets aren't an afterthought — they're where we started." },
      { icon: Award,     title: "Policy compliance is non-negotiable", desc: "We'd rather decline to generate a violation than ship something that gets your account suspended." },
      { icon: Heart,     title: "Honest pricing",                     desc: "We charge for value delivered. No confusing token meters, no bait-and-switch." },
      { icon: Users,     title: "Built for practitioners",            desc: "Every feature was requested by working PPC managers — not invented in a product brainstorm." },
      { icon: TrendingUp, title: "Obsessed with CTR",                 desc: "Every copy decision we make is backed by data on what actually drives click-through rate." },
    ],
    investorsLabel: "Backed by",
    investors: ["Seed Round — $2.1M", "YC S24 alumnus", "Google for Startups"],
    joinLabel: "Join us",
    joinDesc: "We're a small, focused team and we hire carefully. If you're obsessed with PPC, AI, or building great software — we want to hear from you.",
    joinBtn: "View open roles",
  },
  ru: {
    badge: "О нас",
    headline: "Строим будущее",
    headlineGradient: "AI-рекламы",
    subtitle: "AdPilot AI основан в 2023 году с единственной миссией: сделать профессиональный копирайтинг Google Ads доступным для каждого бизнеса — независимо от размера и бюджета.",
    storyLabel: "Наша история",
    story: [
      "Мы начинали как команда PPC-специалистов, разочарованных разрывом между хайпом вокруг AI и реальной эффективностью рекламы. Универсальные AI-инструменты писали тексты, которые звучали умно, но нарушали политику Google Ads, выходили за пределы символов и игнорировали особенности локальных рынков.",
      "Поэтому мы создали AdPilot AI — платформу, объединяющую скорость генеративного AI с точностью профессиональных PPC-знаний. Каждый промпт, каждое правило валидации и каждая проверка модерации написаны сертифицированными специалистами Google Ads.",
      "Сегодня AdPilot AI обслуживает тысячи маркетологов в 30+ странах, с особым фокусом на рынки СНГ, где русскоязычная реклама требует уровня нюансировки, которого обычные западные инструменты просто не могут обеспечить.",
    ],
    statsLabel: "В цифрах",
    stats: [
      { value: "2023",  label: "Год основания" },
      { value: "30+",   label: "Обслуживаемых стран" },
      { value: "50K+",  label: "Созданных объявлений" },
      { value: "99.2%", label: "SLA доступности" },
    ],
    teamLabel: "Команда",
    team: [
      { name: "Алекс Сорокин",  role: "CEO и Co-founder",              initials: "АС", grad: "from-indigo-500 to-violet-600" },
      { name: "Мария Иванова",  role: "CTO и Co-founder",              initials: "МИ", grad: "from-violet-500 to-purple-600" },
      { name: "Дэвид Чэн",      role: "Head of AI",                    initials: "ДЧ", grad: "from-cyan-500 to-blue-600" },
      { name: "Ольга Петрова",  role: "Lead PPC Strategist",           initials: "ОП", grad: "from-emerald-500 to-teal-600" },
      { name: "Джеймс Уилсон", role: "Head of Product",               initials: "ДУ", grad: "from-amber-500 to-orange-600" },
      { name: "Анна Козлова",   role: "Sr. Google Ads Specialist",     initials: "АК", grad: "from-rose-500 to-pink-600" },
    ],
    valuesLabel: "Во что мы верим",
    values: [
      { icon: Zap,        title: "Скорость без потери качества",      desc: "Генерация за секунды, валидированная правилами тысяч реальных кампаний." },
      { icon: Globe,      title: "Локальный фокус, глобальный охват", desc: "Рынки СНГ — не запоздалая мысль, а наша отправная точка." },
      { icon: Award,      title: "Соответствие политике обязательно", desc: "Мы предпочтём отказать в генерации нарушения, чем отправить что-то, что заблокирует ваш аккаунт." },
      { icon: Heart,      title: "Честное ценообразование",           desc: "Мы берём за созданную ценность. Без непонятных счётчиков токенов." },
      { icon: Users,      title: "Создано для практиков",             desc: "Каждая функция запрошена действующими PPC-менеджерами." },
      { icon: TrendingUp, title: "Одержимы CTR",                      desc: "Каждое решение по копирайтингу подкреплено данными о реальном кликрейте." },
    ],
    investorsLabel: "При поддержке",
    investors: ["Seed раунд — $2.1M", "Выпускник YC S24", "Google for Startups"],
    joinLabel: "Присоединяйтесь",
    joinDesc: "Мы небольшая сфокусированная команда и нанимаем тщательно. Если вы увлечены PPC, AI или созданием отличного ПО — мы хотим услышать от вас.",
    joinBtn: "Открытые вакансии",
  },
};

export default function AboutPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 mb-6">
              <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {c.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">{c.headlineGradient}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">{c.subtitle}</p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {c.stats.map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-center">
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-xs text-white/35 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Story */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.storyLabel}</p>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 space-y-4">
              {c.story.map((para, i) => (
                <p key={i} className="text-white/55 leading-relaxed">{para}</p>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.valuesLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1.5">{v.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.teamLabel}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {c.team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.grad} flex items-center justify-center text-sm font-bold text-white mx-auto mb-3`}>
                    {member.initials}
                  </div>
                  <p className="text-xs font-bold text-white leading-snug mb-0.5">{member.name}</p>
                  <p className="text-[10px] text-white/30 leading-snug">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Investors */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-6">{c.investorsLabel}</p>
            <div className="flex flex-wrap gap-3">
              {c.investors.map((inv) => (
                <div key={inv} className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-white/55">{inv}</div>
              ))}
            </div>
          </motion.div>

          {/* Join CTA */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.07] to-indigo-500/[0.05] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <h2 className="text-2xl font-black text-white mb-2">{c.joinLabel}</h2>
            <p className="text-white/40 mb-6 max-w-md mx-auto">{c.joinDesc}</p>
            <Link href="/careers">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer">
                {c.joinBtn} <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
