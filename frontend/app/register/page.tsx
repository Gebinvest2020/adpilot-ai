"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe, GitBranch, Check } from "lucide-react";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useT } from "@/lib/i18n";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useT();
  const r = t.register;

  return (
    <div className="min-h-screen flex" style={{ background: '#050508' }}>
      <AnimatedBackground />

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #080810 0%, #0d0d1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot</span>
            <span className="text-white/40 text-sm font-normal ml-0.5">AI</span>
          </span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              {r.leftHeadline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                {r.leftHeadlineGradient}
              </span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed">{r.leftSubtitle}</p>
          </div>

          <ul className="space-y-4">
            {r.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="text-sm text-white/60">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Fake dashboard preview */}
          <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
            <div className="bg-[#0d0d14] px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-white/30 ml-2">RSA Generator</span>
            </div>
            <div className="bg-[#080810] p-4 space-y-2">
              {[
                "AI-Powered Google Ads Platform | Start Free",
                "Generate High-CTR Ads in 60 Seconds",
                "Trusted by 10,000+ Performance Marketers",
              ].map((hl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400 w-5">{i + 1}</span>
                  <div className="flex-1 text-xs text-white/60 bg-white/[0.03] border border-white/[0.05] rounded px-2 py-1.5 truncate">
                    {hl}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono flex-shrink-0">{30 - i * 3}/30</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/20">© 2025 AdPilot AI, Inc.</p>
      </motion.div>

      {/* Right panel — register form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">{r.headline}</h1>
            <p className="text-white/40">{r.subtitle}</p>
          </div>

          {/* Social signup */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all">
              <Globe className="w-4 h-4" />
              Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all">
              <GitBranch className="w-4 h-4" />
              GitHub
            </motion.button>
          </div>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-white/25 font-medium uppercase tracking-wider">{r.orDivider}</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{r.nameLabel}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={r.namePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{r.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={r.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{r.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={r.passwordPlaceholder}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all mt-2"
            >
              {r.createBtn}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <p className="text-center text-xs text-white/25 mt-4">
            {r.legalText}{" "}
            <a href="#" className="text-white/40 hover:text-white/60 underline underline-offset-2">{r.legalTerms}</a>
            {" "}{r.legalAnd}{" "}
            <a href="#" className="text-white/40 hover:text-white/60 underline underline-offset-2">{r.legalPrivacy}</a>
          </p>

          <p className="text-center text-sm text-white/40 mt-5">
            {r.haveAccount}{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">{r.signIn}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
