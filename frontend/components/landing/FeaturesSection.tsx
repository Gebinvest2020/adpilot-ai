"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, BarChart2, Search, GitBranch, TrendingUp } from "lucide-react";
import { useT } from "@/lib/i18n";

const icons = [Zap, Shield, BarChart2, Search, GitBranch, TrendingUp];
const gradients = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-cyan-600",
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-orange-500 to-rose-600",
];
const glows = [
  "shadow-indigo-500/20",
  "shadow-emerald-500/20",
  "shadow-blue-500/20",
  "shadow-violet-500/20",
  "shadow-cyan-500/20",
  "shadow-orange-500/20",
];
// Index 0 = Most Popular, index 3 = Coming Soon
const TAGS = [0, 3] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FeaturesSection() {
  const t = useT();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
            <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">
              {t.features.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {t.features.headline}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
              {t.features.headlineGradient}
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">{t.features.subtitle}</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {t.features.items.map((feature, index) => {
            const Icon = icons[index];
            const tag = index === 0 ? t.features.mostPopular : index === 3 ? t.features.comingSoon : null;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6 overflow-hidden hover:border-white/[0.12] transition-all duration-300"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.06) 0%, transparent 60%)" }}
                />
                {tag && (
                  <span
                    className={`absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      index === 3
                        ? "bg-white/[0.06] text-white/40"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}
                  >
                    {tag}
                  </span>
                )}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-5 shadow-lg ${glows[index]} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
