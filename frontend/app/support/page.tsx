"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle, BookOpen, Code2, HelpCircle, Cpu, Shield, BarChart2, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STATUS_ICONS = [Zap, Shield, BarChart2, Cpu];
const RESOURCE_ICONS = [BookOpen, Code2, HelpCircle];

export default function SupportPage() {
  const t = useT();
  const s = t.support;

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1400));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar />
      <AnimatedBackground />

      <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/8 mb-6">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">{s.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              {s.headline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                {s.headlineGradient}
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">{s.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
                <h2 className="text-lg font-bold text-white mb-6">{s.formTitle}</h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-12 gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{s.successTitle}</h3>
                      <p className="text-white/45 max-w-sm">{s.successMsg}</p>
                      <button
                        onClick={() => { setIsSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                        className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{s.nameLabel}</label>
                          <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder={s.namePlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{s.emailLabel}</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder={s.emailPlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{s.subjectLabel}</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:border-indigo-500/40 transition-all cursor-pointer appearance-none"
                          required
                        >
                          <option value="" className="bg-[#0d0d14] text-white/40">—</option>
                          {s.subjectOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0d0d14] text-white">{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{s.messageLabel}</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder={s.messagePlaceholder}
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all resize-none leading-relaxed"
                          required
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full py-3.5 rounded-xl text-sm font-bold transition-all",
                          isSubmitting
                            ? "bg-indigo-600/50 text-white/50 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                        )}
                      >
                        {isSubmitting ? s.sendingBtn : s.sendBtn}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Right: Sidebar ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5"
            >
              {/* System Status */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">{s.statusTitle}</h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {s.statusAllOperational}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {s.serviceNames.map((name, i) => {
                    const Icon = STATUS_ICONS[i];
                    return (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-sm text-white/50">{name}</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Resources */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <h3 className="text-sm font-bold text-white mb-4">{s.resourcesTitle}</h3>
                <div className="space-y-2.5">
                  {s.resources.map((res, i) => {
                    const Icon = RESOURCE_ICONS[i];
                    return (
                      <Link
                        key={res.href}
                        href={res.href}
                        className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/75 group-hover:text-white transition-colors">{res.title}</p>
                          <p className="text-xs text-white/35">{res.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
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
