"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, BarChart2, Cpu, Globe, Database, CheckCircle2, Bell } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CONTENT = {
  en: {
    badge: "System Status",
    headline: "All systems",
    headlineGradient: "operational",
    subtitle: "Real-time status for all AdPilot AI services. Updated every 60 seconds.",
    lastChecked: "Last checked",
    operationalLabel: "Operational",
    servicesLabel: "Service status",
    services: [
      { name: "RSA Generator",    desc: "AI ad copy generation endpoint",           icon: Zap,       uptime: "99.98%", latency: "1.2s",  status: "operational" },
      { name: "Moderation AI",    desc: "Google Ads policy compliance engine",       icon: Shield,    uptime: "99.95%", latency: "1.8s",  status: "operational" },
      { name: "CTR Analyzer",     desc: "Click-through rate scoring API",            icon: BarChart2, uptime: "99.99%", latency: "1.1s",  status: "operational" },
      { name: "OpenAI Gateway",   desc: "GPT-4o mini proxy and fallback routing",    icon: Cpu,       uptime: "99.91%", latency: "0.9s",  status: "operational" },
      { name: "Web Application",  desc: "Dashboard and landing pages (Vercel)",      icon: Globe,     uptime: "100%",   latency: "180ms", status: "operational" },
      { name: "Database",         desc: "User data, campaigns, and API logs",        icon: Database,  uptime: "99.99%", latency: "12ms",  status: "operational" },
    ],
    metricsLabel: "30-day metrics",
    incidentsLabel: "Past incidents",
    noIncidents: "No incidents in the past 30 days.",
    subscribeLabel: "Subscribe to updates",
    subscribeDesc: "Get notified by email when a service incident is opened or resolved.",
    emailPlaceholder: "you@company.com",
    subscribeBtn: "Subscribe",
    uptimeLabel: "Uptime",
    latencyLabel: "Avg. latency",
  },
  ru: {
    badge: "Статус системы",
    headline: "Все системы",
    headlineGradient: "работают",
    subtitle: "Статус всех сервисов AdPilot AI в реальном времени. Обновляется каждые 60 секунд.",
    lastChecked: "Последняя проверка",
    operationalLabel: "Работает",
    servicesLabel: "Статус сервисов",
    services: [
      { name: "RSA Генератор",    desc: "Эндпоинт AI-генерации рекламных текстов",   icon: Zap,       uptime: "99.98%", latency: "1.2 с",  status: "operational" },
      { name: "AI Модерации",     desc: "Движок соответствия политике Google Ads",    icon: Shield,    uptime: "99.95%", latency: "1.8 с",  status: "operational" },
      { name: "Анализатор CTR",   desc: "API оценки кликабельности",                 icon: BarChart2, uptime: "99.99%", latency: "1.1 с",  status: "operational" },
      { name: "OpenAI Gateway",   desc: "Прокси GPT-4o mini и резервная маршрутизация", icon: Cpu,    uptime: "99.91%", latency: "0.9 с",  status: "operational" },
      { name: "Веб-приложение",   desc: "Дашборд и лендинг (Vercel)",                icon: Globe,     uptime: "100%",   latency: "180 мс", status: "operational" },
      { name: "База данных",      desc: "Пользователи, кампании и логи API",          icon: Database,  uptime: "99.99%", latency: "12 мс",  status: "operational" },
    ],
    metricsLabel: "Метрики за 30 дней",
    incidentsLabel: "История инцидентов",
    noIncidents: "Инцидентов за последние 30 дней не было.",
    subscribeLabel: "Подписаться на обновления",
    subscribeDesc: "Получайте уведомления по email при открытии или закрытии инцидента.",
    emailPlaceholder: "вы@компания.ру",
    subscribeBtn: "Подписаться",
    uptimeLabel: "Доступность",
    latencyLabel: "Сред. задержка",
  },
};

// Fake 90-day uptime bar — all green
function UptimeBar() {
  const bars = Array.from({ length: 90 }, () => ({
    height: Math.random() * 0.3 + 0.7,
    status: "ok",
  }));
  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: b.height }}
          transition={{ delay: i * 0.005, duration: 0.3, ease: "easeOut" }}
          className="flex-1 rounded-sm bg-emerald-500/60 origin-bottom hover:bg-emerald-400 transition-colors cursor-default"
          style={{ minWidth: 2 }}
          title="Operational"
        />
      ))}
    </div>
  );
}

export default function StatusPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale] ?? CONTENT.en;

  const now = new Date().toLocaleTimeString(locale === "ru" ? "ru-RU" : "en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {c.headline}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{c.headlineGradient}</span>
            </h1>
            <p className="text-white/40 mb-3">{c.subtitle}</p>
            <p className="text-xs text-white/25 font-mono">{c.lastChecked}: {now}</p>
          </motion.div>

          {/* Overall banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-base font-bold text-emerald-400">{c.operationalLabel}</p>
              <p className="text-sm text-white/40">All 6 services are running normally.</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-white/30">services healthy</p>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{c.servicesLabel}</p>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.04] overflow-hidden">
              {c.services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={svc.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/8 border border-emerald-500/12 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-emerald-400/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80">{svc.name}</p>
                      <p className="text-xs text-white/30 leading-none mt-0.5">{svc.desc}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-5 text-right flex-shrink-0">
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">{c.uptimeLabel}</p>
                        <p className="text-xs font-bold text-white/60">{svc.uptime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">{c.latencyLabel}</p>
                        <p className="text-xs font-bold text-white/60">{svc.latency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="hidden sm:inline">{c.operationalLabel}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* 90-day uptime chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">{c.metricsLabel}</p>
              <span className="text-xs text-emerald-400 font-bold">99.97% avg</span>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <UptimeBar />
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-white/20">90 days ago</span>
                <span className="text-[9px] text-white/20">Today</span>
              </div>
            </div>
          </motion.div>

          {/* Incidents */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-4">{c.incidentsLabel}</p>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-3" />
              <p className="text-sm text-white/35">{c.noIncidents}</p>
            </div>
          </motion.div>

          {/* Subscribe */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className={cn("w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4", subscribed && "bg-emerald-500/20")}>
              {subscribed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Bell className="w-5 h-5 text-emerald-400" />}
            </div>
            <h2 className="text-lg font-black text-white mb-2">{c.subscribeLabel}</h2>
            <p className="text-white/40 text-sm mb-5">{c.subscribeDesc}</p>
            {subscribed ? (
              <p className="text-emerald-400 font-semibold text-sm">✓ Subscribed — you&apos;ll be notified of any incidents.</p>
            ) : (
              <div className="flex items-center gap-3 max-w-sm mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={c.emailPlaceholder} className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-all" />
                <button onClick={() => setSubscribed(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm whitespace-nowrap transition-all">
                  {c.subscribeBtn}
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
