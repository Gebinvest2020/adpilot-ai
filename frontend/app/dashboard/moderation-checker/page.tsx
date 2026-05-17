"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Loader2, CheckCircle2, AlertCircle, AlertTriangle,
  Brain, Eye, TrendingUp, DollarSign, Coins, Heart, Zap, Briefcase,
  RefreshCw,
} from "lucide-react";
import { checkModeration } from "@/lib/fake-ai/moderation-checker";
import type { ModerationCheckResult, ModerationPolicyFlag, ModerationCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useT, useLocale } from "@/lib/i18n";

// ─── Preset copy constants ─────────────────────────────────────────────────────

const PRESET_COPY_EN = [
  `Crypto Trading Profits Guaranteed
Earn $500/day Trading Bitcoin — Risk-Free
Join 50,000 traders earning 300% returns
Start with just $100, triple your money`,

  `Guaranteed Investment Returns
Risk-free investing with 25% annual yield
Your money grows 100% guaranteed
Earn passive income — zero risk, 100% return`,

  `Cure Cancer Naturally — Clinically Proven
Our supplement eliminates tumors in 30 days
100% cure rate — no chemotherapy needed
Heal chronic disease with our breakthrough formula`,

  `Lose 20kg in 7 Days — Guaranteed
Burns fat without diet or exercise
Shocking results: drop 3 dress sizes in a week
100% guaranteed weight loss — or money back`,

  `World's #1 Financial Advisor
Guaranteed profits — we beat every market
100% risk-free investment strategy
Best returns in the world — verified by us`,

  `Make $5000/month Working From Home
Earn $200/day — no experience needed
Join thousands earning $10,000/week online
Free money system — earn while you sleep`,
];

const PRESET_COPY_RU = [
  `Гарантированная прибыль от крипто трейдинга
Зарабатывай $500/день на Bitcoin — без риска
50,000 трейдеров получают доход 300%
Начни со 100$, утрой капитал за месяц`,

  `Гарантированный доход 25% годовых
Инвестиции без риска — 100% возврат средств
Ваши деньги растут гарантированно
Пассивный доход — ноль риска, 100% гарантия`,

  `Вылечим рак натуральными средствами
Наш препарат уничтожает опухоли за 30 дней
Гарантированное лечение — без химиотерапии
Исцеление хронических болезней: результат 100%`,

  `Похудей на 20кг за 7 дней — гарантия
Сжигает жир без диеты и спорта
Шокирующие результаты: -3 размера за неделю
Гарантированное снижение веса или деньги назад`,

  `Лучший финансовый советник в мире #1
Гарантированная прибыль на любом рынке
100% безрисковая инвестиционная стратегия
Лучшая доходность в мире — проверено нами`,

  `Зарабатывай $5000/месяц из дома
Доход $200 в день — опыт не нужен
Тысячи зарабатывают $10,000 в неделю онлайн
Бесплатная система — зарабатывай пока спишь`,
];

// ─── Category icons ────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ModerationCategory, React.ComponentType<{ className?: string }>> = {
  misleading:   Eye,
  unrealistic:  TrendingUp,
  financial:    DollarSign,
  crypto:       Coins,
  healthcare:   Heart,
  sensational:  Zap,
  employment:   Briefcase,
  other:        AlertCircle,
};

// ─── Score ring component ──────────────────────────────────────────────────────

function ScoreRing({ score, labelLow, labelMedium, labelHigh }: {
  score: number;
  labelLow: string;
  labelMedium: string;
  labelHigh: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const isHigh   = score >= 75;
  const isMedium = score >= 45 && score < 75;
  const strokeColor  = isHigh ? "#10b981" : isMedium ? "#f59e0b" : "#ef4444";
  const riskLabel    = isHigh ? labelLow  : isMedium ? labelMedium : labelHigh;
  const riskTextCls  = isHigh ? "text-emerald-400 bg-emerald-500/10" : isMedium ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
          <circle cx="72" cy="72" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="72" cy="72" r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-3xl font-black text-white leading-none"
          >
            {score}
          </motion.span>
          <span className="text-xs text-white/30 font-medium">/ 100</span>
        </div>
      </div>
      <div className={cn("px-4 py-1.5 rounded-full text-sm font-bold tracking-wide", riskTextCls)}>
        {riskLabel}
      </div>
    </div>
  );
}

// ─── Flag card component ───────────────────────────────────────────────────────

function FlagCard({
  flag, index,
  triggerLabel, explanationLabel, saferVersionLabel,
  severityHigh, severityMedium, severityLow,
  categoryLabel,
  suspensionRiskLabel,
}: {
  flag: ModerationPolicyFlag;
  index: number;
  triggerLabel: string;
  explanationLabel: string;
  saferVersionLabel: string;
  severityHigh: string;
  severityMedium: string;
  severityLow: string;
  categoryLabel: string;
  suspensionRiskLabel: string;
}) {
  const Icon = CATEGORY_ICONS[flag.category];

  const severityCls = {
    high:   "border-red-500/25 bg-red-500/[0.05]",
    medium: "border-amber-500/25 bg-amber-500/[0.05]",
    low:    "border-blue-500/25 bg-blue-500/[0.05]",
  }[flag.severity];

  const badgeCls = {
    high:   "text-red-400 bg-red-500/10 border-red-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    low:    "text-blue-400 bg-blue-500/10 border-blue-500/20",
  }[flag.severity];

  const iconCls = {
    high:   "text-red-400",
    medium: "text-amber-400",
    low:    "text-blue-400",
  }[flag.severity];

  const severityLabel = { high: severityHigh, medium: severityMedium, low: severityLow }[flag.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.07 }}
      className={cn("rounded-xl border p-4 space-y-3", severityCls)}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Icon className={cn("w-4 h-4 flex-shrink-0", iconCls)} />
        <span className="text-sm font-bold text-white/85 flex-1">{categoryLabel}</span>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", badgeCls)}>
          {severityLabel}
        </span>
      </div>

      {/* Suspension warning */}
      {flag.severity === "high" && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-400/80">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>{suspensionRiskLabel}</span>
        </div>
      )}

      {/* Trigger text */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">{triggerLabel}</p>
        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]">
          <span className="text-xs font-mono text-white/70">&ldquo;{flag.triggerText}&rdquo;</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">{explanationLabel}</p>
        <p className="text-xs text-white/55 leading-relaxed">{flag.explanation}</p>
      </div>

      {/* Safer version */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">{saferVersionLabel}</p>
        <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15">
          <p className="text-xs text-emerald-400/80 leading-relaxed">{flag.saferVersion}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading state ─────────────────────────────────────────────────────────────

function LoadingState({ title, steps }: { title: string; steps: readonly string[] }) {
  const [activeStep, setActiveStep] = useState(0);

  // Advance through steps on a timer
  useState(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 700)
    );
    return () => timers.forEach(clearTimeout);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 flex flex-col items-center gap-6"
    >
      {/* Animated shield */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center"
        >
          <Shield className="w-7 h-7 text-emerald-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute -inset-1.5 rounded-2xl border-2 border-transparent border-t-emerald-500/40"
        />
      </div>

      <p className="text-sm font-semibold text-white/60">{title}</p>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-2.5">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: i <= activeStep ? 1 : 0.2 }}
            className="flex items-center gap-3"
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
              i < activeStep
                ? "bg-emerald-500/20 border border-emerald-500/40"
                : i === activeStep
                ? "bg-emerald-500/10 border border-emerald-500/30"
                : "bg-white/[0.04] border border-white/[0.08]"
            )}>
              {i < activeStep ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : i === activeStep ? (
                <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </div>
            <span className={cn(
              "text-xs transition-colors duration-300",
              i <= activeStep ? "text-white/70" : "text-white/25"
            )}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ title, subtitle, hints }: {
  title: string;
  subtitle: string;
  hints: readonly string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12 flex flex-col items-center gap-5 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
        <Shield className="w-6 h-6 text-white/15" />
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-white/40">{title}</p>
        <p className="text-sm text-white/25">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {hints.map((hint, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-white/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/30 flex-shrink-0" />
            <span>{hint}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ModerationCheckerPage() {
  const t = useT();
  const m = t.moderation;
  const { locale } = useLocale();

  const [adCopy, setAdCopy]   = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<ModerationCheckResult | null>(null);

  const presets = locale === "ru" ? PRESET_COPY_RU : PRESET_COPY_EN;

  // ── Fetch from OpenAI, fall back to rule-based ──────────────────────────────
  const fetchResult = async (): Promise<ModerationCheckResult> => {
    const language = locale === "ru" ? "Russian" : "English";
    try {
      const res = await fetch("/api/ai/moderation-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adCopy, industry, language }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      if (
        typeof data === "object" && data !== null &&
        "error" in data
      ) throw new Error(String((data as Record<string, unknown>).error));
      return data as ModerationCheckResult;
    } catch (e) {
      console.warn("[moderation-checker] ⚠️  API failed, using local fallback:", (e as Error).message);
      return checkModeration(adCopy, industry, language);
    }
  };

  const handleCheck = async () => {
    if (!adCopy.trim()) return;
    setLoading(true);
    setResult(null);

    // Parallel: start API call + run animation timer
    const resultPromise = fetchResult();
    const minWait = new Promise<void>(r => setTimeout(r, 2800));
    await minWait;
    const res = await resultPromise;

    setResult(res);
    setLoading(false);
  };

  const handleRecheck = () => {
    setResult(null);
    handleCheck();
  };

  // ── Category label lookup ──────────────────────────────────────────────────
  const getCategoryLabel = (cat: ModerationCategory): string => ({
    misleading:  m.categoryMisleading,
    unrealistic: m.categoryUnrealistic,
    financial:   m.categoryFinancial,
    crypto:      m.categoryCrypto,
    healthcare:  m.categoryHealthcare,
    sensational: m.categorySensational,
    employment:  m.categoryEmployment,
    other:       m.categoryOther,
  }[cat]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{m.pageTitle}</h1>
        </div>
        <p className="text-sm text-white/40 ml-12">{m.pageSubtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── LEFT: Input panel ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5"
        >
          {/* Preset chips */}
          <div>
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">
              {m.presetsLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {m.presets.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setAdCopy(presets[i] ?? "")}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/45 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Ad copy textarea */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-1.5">
              {m.adCopyLabel}
            </label>
            <textarea
              value={adCopy}
              onChange={e => setAdCopy(e.target.value)}
              placeholder={m.adCopyPlaceholder}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/35 transition-all resize-none leading-relaxed"
            />
            <p className="mt-1.5 text-[11px] text-white/25">{m.adCopyHint}</p>
          </div>

          {/* Industry select */}
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-1.5">
              {m.industryLabel}
            </label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-emerald-500/35 transition-all"
            >
              <option value="" className="bg-[#111118]">{m.industryPlaceholder}</option>
              {m.industries.map(ind => (
                <option key={ind} value={ind} className="bg-[#111118]">{ind}</option>
              ))}
            </select>
          </div>

          {/* CTA button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={result ? handleRecheck : handleCheck}
            disabled={loading || !adCopy.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{m.checkingBtn}</>
            ) : result ? (
              <><RefreshCw className="w-4 h-4" />{m.recheckBtn}</>
            ) : (
              <><Shield className="w-4 h-4" />{m.checkBtn}</>
            )}
          </motion.button>
        </motion.div>

        {/* ── RIGHT: Results panel ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {/* Loading */}
            {loading && (
              <LoadingState
                key="loading"
                title={m.loadingTitle}
                steps={m.loadingSteps}
              />
            )}

            {/* Empty state */}
            {!loading && !result && (
              <EmptyState
                key="empty"
                title={m.emptyTitle}
                subtitle={m.emptySubtitle}
                hints={m.emptyHints}
              />
            )}

            {/* Results */}
            {!loading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Score card */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ScoreRing
                      score={result.overallScore}
                      labelLow={m.riskLow}
                      labelMedium={m.riskMedium}
                      labelHigh={m.riskHigh}
                    />
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                            {m.overallScoreLabel}
                          </p>
                          {result.aiMode && (
                            <span className={cn(
                              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              result.aiMode === "openai"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", result.aiMode === "openai" ? "bg-emerald-400 animate-pulse" : "bg-amber-400")} />
                              {result.aiMode === "openai" ? m.aiModeOpenAI : m.aiModeFallback}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white/35 uppercase tracking-wider mb-1">
                          {m.summaryLabel}
                        </p>
                        <p className="text-sm text-white/55 leading-relaxed">{result.summary}</p>
                      </div>

                      {/* Severity breakdown badges */}
                      {result.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {result.flags.filter(f => f.severity === "high").length > 0 && (
                            <span className="text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20 font-semibold">
                              {result.flags.filter(f => f.severity === "high").length} {m.severityHigh}
                            </span>
                          )}
                          {result.flags.filter(f => f.severity === "medium").length > 0 && (
                            <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 font-semibold">
                              {result.flags.filter(f => f.severity === "medium").length} {m.severityMedium}
                            </span>
                          )}
                          {result.flags.filter(f => f.severity === "low").length > 0 && (
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20 font-semibold">
                              {result.flags.filter(f => f.severity === "low").length} {m.severityLow}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Checked at */}
                      <p className="text-[11px] text-white/20">{result.checkedAt}</p>
                    </div>
                  </div>
                </div>

                {/* AI analysis note */}
                {result.analysisNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex gap-3 p-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.05]"
                  >
                    <Brain className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-wider mb-1">
                        {m.aiAnalysisLabel}
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">{result.analysisNote}</p>
                    </div>
                  </motion.div>
                )}

                {/* Flags section */}
                <div>
                  <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3">
                    {m.flagsLabel}
                    {result.flags.length > 0 && (
                      <span className="ml-2 text-white/20 normal-case tracking-normal font-normal">
                        ({result.flags.length})
                      </span>
                    )}
                  </p>

                  {result.flags.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2 py-8 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04]"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                      <p className="text-sm font-semibold text-emerald-400/70">{m.noIssuesTitle}</p>
                      <p className="text-xs text-white/30">{m.noIssuesSub}</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {result.flags.map((flag, i) => (
                        <FlagCard
                          key={flag.id}
                          flag={flag}
                          index={i}
                          triggerLabel={m.triggerLabel}
                          explanationLabel={m.explanationLabel}
                          saferVersionLabel={m.saferVersionLabel}
                          severityHigh={m.severityHigh}
                          severityMedium={m.severityMedium}
                          severityLow={m.severityLow}
                          categoryLabel={getCategoryLabel(flag.category)}
                          suspensionRiskLabel={m.suspensionRiskLabel}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Safe items section */}
                {result.safeItems.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-2.5">
                      {m.safeItemsLabel}
                    </p>
                    <div className="space-y-1.5">
                      {result.safeItems.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.06 }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/12"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0" />
                          <span className="text-xs text-white/50">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
