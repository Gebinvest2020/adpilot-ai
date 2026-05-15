"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, Rocket } from "lucide-react";
import { useT } from "@/lib/i18n";

const icons = [FileText, Cpu, Rocket];
const gradients = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-purple-600",
  "from-purple-500 to-pink-600",
];
const glows = [
  "rgba(99,102,241,0.3)",
  "rgba(139,92,246,0.3)",
  "rgba(168,85,247,0.3)",
];

export default function HowItWorksSection() {
  const t = useT();

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 mb-6">
            <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
              {t.howItWorks.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {t.howItWorks.headline}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
              {t.howItWorks.headlineGradient}
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">{t.howItWorks.subtitle}</p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-purple-500/30" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
            {t.howItWorks.steps.map((step, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center px-6"
                >
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-2xl`}
                      style={{ boxShadow: `0 0 40px ${glows[index]}` }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0d0d14] border border-white/[0.1] flex items-center justify-center text-[10px] font-black text-white/40">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
