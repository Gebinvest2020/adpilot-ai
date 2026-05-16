"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Globe, GitBranch } from "lucide-react";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useT();
  const l = t.login;

  return (
    <div className="min-h-screen flex" style={{ background: '#050508' }}>
      <AnimatedBackground />

      {/* Left panel — product showcase */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #080810 0%, #0d0d1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot</span>
            <span className="text-white/40 text-sm font-normal ml-0.5">AI</span>
          </span>
        </div>

        {/* Feature highlight */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              {l.leftHeadline}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                {l.leftHeadlineGradient}
              </span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed">{l.leftSubtitle}</p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {l.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <p className="text-sm text-white/60 leading-relaxed italic mb-4">
              &ldquo;{l.testimonialQuote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                {l.testimonialName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{l.testimonialName}</p>
                <p className="text-xs text-white/40">{l.testimonialRole}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/20">© 2025 AdPilot AI, Inc.</p>
      </motion.div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">AdPilot AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">{l.headline}</h1>
            <p className="text-white/40">{l.subtitle}</p>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all"
            >
              <Globe className="w-4 h-4" />
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white text-sm font-medium transition-all"
            >
              <GitBranch className="w-4 h-4" />
              GitHub
            </motion.button>
          </div>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-white/25 font-medium uppercase tracking-wider">{l.orDivider}</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{l.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={l.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">{l.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={l.passwordPlaceholder}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.04] accent-indigo-600" />
                <span className="text-xs text-white/40">{l.rememberMe}</span>
              </label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">{l.forgotPassword}</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all mt-2"
            >
              {l.signInBtn}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            {l.noAccount}{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              {l.signUpFree}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
