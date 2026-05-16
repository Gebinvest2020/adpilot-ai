"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { pricingPlans } from "@/lib/mock-data";
import { useT, interp } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const t = useT();
  const p = t.pricing;

  const planKeys = ["starter", "growth", "enterprise"] as const;

  const comparisonRows: {
    key: keyof typeof p.table;
    starter: string | boolean;
    growth: string | boolean;
    enterprise: string | boolean;
  }[] = [
    { key: "adsPerMonth",        starter: "100",                           growth: "500",                                    enterprise: p.unlimited },
    { key: "rsaGenerator",       starter: true,                            growth: true,                                     enterprise: true },
    { key: "moderationChecker",  starter: p.basic,                         growth: p.advanced,                               enterprise: p.advanced },
    { key: "ctrAnalyzer",        starter: true,                            growth: true,                                     enterprise: true },
    { key: "keywordIntelligence",starter: false,                           growth: true,                                     enterprise: true },
    { key: "abTesting",          starter: false,                           growth: true,                                     enterprise: true },
    { key: "apiAccess",          starter: false,                           growth: interp(p.callsPerMonth, { n: "1,000" }),  enterprise: p.unlimited },
    { key: "userSeats",          starter: "1",                             growth: "5",                                      enterprise: p.unlimited },
    { key: "whiteLabelExports",  starter: false,                           growth: true,                                     enterprise: true },
    { key: "customAiFineTuning", starter: false,                           growth: false,                                    enterprise: true },
    { key: "dedicatedSupport",   starter: false,                           growth: false,                                    enterprise: true },
    { key: "ssoManagement",      starter: false,                           growth: false,                                    enterprise: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">{p.badge}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
              {p.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                {p.headlineGradient}
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">{p.subtitle}</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  !annual ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                {p.monthly}
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  annual ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                {p.annual}
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </motion.div>

          {/* ── Pricing cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {pricingPlans.map((plan, index) => {
              const key = plan.id as typeof planKeys[number];
              const planTx = p.plans[key];
              const price = annual ? Math.floor(plan.price * 0.8) : plan.price;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  className={cn(
                    "relative rounded-2xl p-7 flex flex-col",
                    plan.popular
                      ? "border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-violet-950/20 shadow-2xl shadow-indigo-500/10"
                      : "border border-white/[0.07] bg-white/[0.02]"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg">
                        <Zap className="w-3 h-3" fill="white" />
                        {p.mostPopular}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">{planTx.name}</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-6">{planTx.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">${price}</span>
                      <span className="text-white/40 text-sm">{p.perMonth}</span>
                    </div>
                    {annual && (
                      <p className="text-xs text-emerald-400 mt-1">
                        {interp(p.saveYear, { amount: String((plan.price - price) * 12) })}
                      </p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={plan.id === "enterprise" ? "/support" : "/register"}
                      className={cn(
                        "block w-full py-3 px-6 rounded-xl text-center text-sm font-bold transition-all duration-200 mb-8",
                        plan.popular
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                          : "border border-white/[0.12] text-white/80 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      {planTx.cta}
                    </Link>
                  </motion.div>

                  <ul className="space-y-3 flex-1">
                    {planTx.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* ── Comparison table ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black text-white text-center mb-10">{p.compareTitle}</h3>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-4 border-b border-white/[0.07] bg-white/[0.03]">
                <div className="p-4 text-sm text-white/30 font-medium">{p.tableFeatureCol}</div>
                {planKeys.map((k) => (
                  <div key={k} className="p-4 text-sm font-bold text-white text-center">
                    {p.plans[k].name}
                  </div>
                ))}
              </div>

              {comparisonRows.map((row, i) => (
                <div
                  key={row.key}
                  className={cn(
                    "grid grid-cols-4 border-b border-white/[0.04] transition-colors",
                    i % 2 === 0 ? "bg-white/[0.01]" : ""
                  )}
                >
                  <div className="p-4 text-sm text-white/50">{p.table[row.key]}</div>
                  {([row.starter, row.growth, row.enterprise] as (string | boolean)[]).map((val, ci) => (
                    <div key={ci} className="p-4 text-center">
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="w-4 h-4 text-indigo-400 mx-auto" />
                        ) : (
                          <span className="text-white/20 text-lg">—</span>
                        )
                      ) : (
                        <span className="text-sm text-white/60 font-medium">{val}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── FAQ CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-white/40 text-sm">
              {p.faqText}{" "}
              <Link href="/faq" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
                {p.faqLink}
              </Link>
              {" "}{p.faqOr}{" "}
              <Link href="/support" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
                {p.salesLink}
              </Link>
            </p>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
