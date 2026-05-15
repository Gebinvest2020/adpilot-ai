"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { pricingPlans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const comparisonFeatures = [
  { label: "AI-generated ads/month", starter: "100", growth: "500", enterprise: "Unlimited" },
  { label: "RSA Generator", starter: true, growth: true, enterprise: true },
  { label: "Moderation Checker", starter: "Basic", growth: "Advanced", enterprise: "Advanced" },
  { label: "CTR Analyzer", starter: true, growth: true, enterprise: true },
  { label: "Keyword Intelligence", starter: false, growth: true, enterprise: true },
  { label: "A/B Testing", starter: false, growth: true, enterprise: true },
  { label: "API Access", starter: false, growth: "1,000 calls/mo", enterprise: "Unlimited" },
  { label: "User seats", starter: "1", growth: "5", enterprise: "Unlimited" },
  { label: "White-label exports", starter: false, growth: true, enterprise: true },
  { label: "Custom AI fine-tuning", starter: false, growth: false, enterprise: true },
  { label: "Dedicated support", starter: false, growth: false, enterprise: true },
  { label: "SSO & team management", starter: false, growth: false, enterprise: true },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-6">
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">Pricing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
              Simple, transparent
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">pricing</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  !annual ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  annual ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Annual
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {pricingPlans.map((plan, index) => {
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
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">${price}</span>
                      <span className="text-white/40 text-sm">/month</span>
                    </div>
                    {annual && (
                      <p className="text-xs text-emerald-400 mt-1">Save ${(plan.price - price) * 12}/year</p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={plan.id === "enterprise" ? "#" : "/register"}
                      className={cn(
                        "block w-full py-3 px-6 rounded-xl text-center text-sm font-bold transition-all duration-200 mb-8",
                        plan.popular
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                          : "border border-white/[0.12] text-white/80 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      {plan.cta}
                    </Link>
                  </motion.div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
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

          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-black text-white text-center mb-10">Compare all features</h3>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 border-b border-white/[0.07] bg-white/[0.03]">
                <div className="p-4 text-sm text-white/30 font-medium">Feature</div>
                {["Starter", "Growth", "Enterprise"].map((name) => (
                  <div key={name} className="p-4 text-sm font-bold text-white text-center">{name}</div>
                ))}
              </div>

              {comparisonFeatures.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-4 border-b border-white/[0.04] transition-colors",
                    i % 2 === 0 ? "bg-white/[0.01]" : ""
                  )}
                >
                  <div className="p-4 text-sm text-white/50">{row.label}</div>
                  {[row.starter, row.growth, row.enterprise].map((val, ci) => (
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

          {/* FAQ CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-white/40 text-sm">
              Have questions?{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
                Read our FAQ
              </a>
              {" "}or{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
                contact sales
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
