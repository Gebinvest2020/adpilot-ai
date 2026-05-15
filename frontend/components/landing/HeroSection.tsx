"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, TrendingUp, Globe, Users } from "lucide-react";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useT } from "@/lib/i18n";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function HeroSection() {
  const t = useT();

  const stats = [
    { icon: TrendingUp, label: t.hero.stats.adsLabel,        value: "10K+" },
    { icon: Sparkles,   label: t.hero.stats.ctrLabel,        value: "94%"  },
    { icon: Globe,      label: t.hero.stats.countriesLabel,  value: "50+"  },
    { icon: Users,      label: t.hero.stats.marketersLabel,  value: "3K+"  },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
              <span className="text-indigo-400 text-sm">✦</span>
              <span className="text-sm text-indigo-300 font-medium">{t.hero.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              {t.hero.headline1}
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
                {t.hero.headline2}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed font-light"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all duration-200"
              >
                {t.hero.cta1}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-white/70 hover:text-white border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all duration-200">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                {t.hero.cta2}
              </button>
            </motion.div>
          </motion.div>

          {/* Trust badge */}
          <motion.p variants={itemVariants} className="text-xs text-white/30 font-medium">
            {t.hero.trustBadge}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                >
                  <Icon className="w-4 h-4 text-indigo-400 mb-1" />
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                  <span className="text-xs text-white/40 font-medium text-center">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative max-w-4xl mx-auto mt-12"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-indigo-500/10">
              <div className="bg-[#0d0d14] p-4 border-b border-white/[0.06] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center px-3">
                  <span className="text-xs text-white/30">app.adpilot.ai/dashboard</span>
                </div>
              </div>
              <div className="bg-[#080810] p-6 grid grid-cols-4 gap-3">
                {[
                  { label: t.dashboard.statLabels[0], value: "1,247", color: "from-indigo-500/20 to-violet-500/20 border-indigo-500/20" },
                  { label: t.dashboard.statLabels[1], value: "+340%", color: "from-emerald-500/20 to-cyan-500/20 border-emerald-500/20" },
                  { label: t.dashboard.statLabels[2], value: "98.2%", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/20" },
                  { label: t.dashboard.statLabels[3], value: "23",    color: "from-violet-500/20 to-purple-500/20 border-violet-500/20" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-xl border bg-gradient-to-br ${card.color} p-3 text-center`}
                  >
                    <p className="text-xl font-bold text-white">{card.value}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-tight">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
