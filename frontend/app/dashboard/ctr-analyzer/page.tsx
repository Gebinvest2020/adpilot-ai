"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2, Loader2, Wand2, ChevronDown, Brain, Zap, RefreshCw,
} from "lucide-react";
import { analyzeCTR } from "@/lib/fake-ai/ctr-analyzer";
import type { CTRAnalysisResult, CTRBreakdownKey } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useT, useLocale } from "@/lib/i18n";

// ─── AI Mode badge ─────────────────────────────────────────────────────────────

function AiModeBadge({ mode, labelOpenAI, labelFallback }: {
  mode: "openai" | "fallback";
  labelOpenAI: string;
  labelFallback: string;
}) {
  if (mode === "openai") {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {labelOpenAI}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      {labelFallback}
    </span>
  );
}

// ─── Score gauge (semicircle) ──────────────────────────────────────────────────

function ScoreGauge({ score, labelExcellent, labelAverage, labelNeedsWork }: {
  score: number;
  labelExcellent: string;
  labelAverage: string;
  labelNeedsWork: string;
}) {
  const radius = 70;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? labelExcellent : score >= 60 ? labelAverage : labelNeedsWork;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-24">
        <svg className="w-full h-full" viewBox="0 0 160 80">
          <path
            d="M10,80 A70,70 0 0,1 150,80"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            d="M10,80 A70,70 0 0,1 150,80"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-black text-white leading-none"
          >
            {score}
          </motion.p>
          <p className="text-xs text-white/30">/ 100</p>
        </div>
      </div>
      <p className="text-sm font-bold mt-2" style={{ color }}>{label}</p>
    </div>
  );
}

// ─── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ name, score, status, index }: {
  name: string;
  score: number;
  status: string;
  index: number;
}) {
  const gradients: Record<string, string> = {
    excellent:    "from-emerald-500 to-cyan-500",
    good:         "from-blue-500 to-indigo-500",
    average:      "from-amber-500 to-orange-500",
    "needs-work": "from-red-500 to-rose-500",
  };
  const textColors: Record<string, string> = {
    excellent:    "text-emerald-400",
    good:         "text-blue-400",
    average:      "text-amber-400",
    "needs-work": "text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">{name}</span>
        <span className={cn("text-sm font-bold", textColors[status] ?? "text-white/40")}>{score}/100</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.08, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", gradients[status] ?? "from-white/20 to-white/10")}
        />
      </div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CTRAnalyzerPage() {
  const t = useT();
  const c = t.ctr;
  const { locale } = useLocale();

  const [adText, setAdText]     = useState("");
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<CTRAnalysisResult | null>(null);
  const [showImproved, setShowImproved] = useState(false);

  const language = locale === "ru" ? "Russian" : "English";

  // ── Fetch from OpenAI, fallback to local ──────────────────────────────────
  const fetchResult = async (): Promise<CTRAnalysisResult> => {
    try {
      const res = await fetch("/api/ai/ctr-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adCopy: adText, keywords, industry, language }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as Record<string, unknown>;
        console.warn("[ctr-analyzer] API returned", res.status, err.message ?? err.error);
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      if (
        typeof data === "object" && data !== null && "error" in data
      ) throw new Error(String((data as Record<string, unknown>).error));
      console.log("[ctr-analyzer] ✅ OpenAI result received, aiMode=openai");
      return data as CTRAnalysisResult;
    } catch (e) {
      console.warn("[ctr-analyzer] ⚠️  Falling back to local analyzer:", (e as Error).message);
      return analyzeCTR(adText, keywords, industry, language);
    }
  };

  const handleAnalyze = async () => {
    if (!adText.trim()) return;
    setLoading(true);
    setResult(null);
    setShowImproved(false);

    const resultPromise = fetchResult();
    await new Promise(r => setTimeout(r, 2000));
    const res = await resultPromise;
    setResult(res);
    setLoading(false);
  };

  const handleReanalyze = () => {
    setResult(null);
    handleAnalyze();
  };

  // Map CTRBreakdownKey → localized label
  const breakdownName = (key: CTRBreakdownKey): string => c.breakdownNames[key];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{c.pageTitle}</h1>
        </div>
        <p className="text-sm text-white/40 ml-12">{c.pageSubtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT: Input ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5 h-fit"
        >
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">{c.inputTitle}</h2>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-1.5">{c.adCopyLabel}</label>
            <textarea
              value={adText}
              onChange={e => setAdText(e.target.value)}
              placeholder={c.adCopyPlaceholder}
              rows={8}
              className="w-full px-3.5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-1.5">{c.keywordsLabel}</label>
            <input
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder={c.keywordsPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-1.5">{c.industryLabel}</label>
            <div className="relative">
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#111118]">{c.industryPlaceholder}</option>
                {c.industries.map(ind => (
                  <option key={ind} value={ind} className="bg-[#111118]">{ind}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <div>
              <p className="text-sm font-medium text-white/60">{c.competitorTitle}</p>
              <p className="text-xs text-white/30 mt-0.5">{c.competitorDesc}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 relative">
              <span className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-400" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={result ? handleReanalyze : handleAnalyze}
            disabled={loading || !adText.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{c.analyzingBtn}</>
            ) : result ? (
              <><RefreshCw className="w-4 h-4" />{c.reanalyzingBtn}</>
            ) : (
              <><BarChart2 className="w-4 h-4" />{c.analyzeBtn}</>
            )}
          </motion.button>
        </motion.div>

        {/* ── RIGHT: Results ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <AnimatePresence mode="wait">

            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 space-y-6"
              >
                <div className="w-44 h-24 rounded-xl bg-white/[0.04] mx-auto animate-pulse" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 bg-white/[0.04] rounded-full w-40 animate-pulse" />
                      <div className="h-2 bg-white/[0.03] rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty */}
            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-16 text-center"
              >
                <BarChart2 className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 text-sm font-medium">{c.emptyMsg}</p>
              </motion.div>
            )}

            {/* Results */}
            {!loading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Overall score */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{c.overallScoreLabel}</p>
                    <AiModeBadge
                      mode={result.aiMode ?? "fallback"}
                      labelOpenAI={c.aiModeOpenAI}
                      labelFallback={c.aiModeFallback}
                    />
                  </div>
                  <ScoreGauge
                    score={result.overallScore}
                    labelExcellent={c.scoreExcellent}
                    labelAverage={c.scoreAverage}
                    labelNeedsWork={c.scoreNeedsWork}
                  />
                  <p className="text-[11px] text-white/20 mt-3">{result.checkedAt}</p>
                </div>

                {/* Breakdown */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{c.breakdownLabel}</p>
                  {result.breakdown.map((item, i) => (
                    <ScoreBar
                      key={item.key}
                      name={breakdownName(item.key)}
                      score={item.score}
                      status={item.status}
                      index={i}
                    />
                  ))}
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{c.recommendationsLabel}</p>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.07 }}
                        className="flex items-start gap-2.5 text-sm text-white/55 leading-relaxed"
                      >
                        <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Improve button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowImproved(!showImproved)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  {showImproved ? c.hideBtn : c.improveBtn}
                </motion.button>

                {/* Improved version */}
                <AnimatePresence>
                  {showImproved && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-3.5 h-3.5 text-indigo-400" />
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{c.improvedVersionLabel}</p>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ml-auto">
                          <Zap className="w-3 h-3 inline mr-0.5" />+CTR
                        </span>
                      </div>

                      {/* Improved headlines */}
                      <div className="space-y-2">
                        {result.improvedHeadlines.map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2">
                            <span className="text-[10px] text-indigo-400/60 w-4">{i + 1}</span>
                            <span className="text-sm text-white/80 flex-1">{hl}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">{hl.length}/30</span>
                          </div>
                        ))}
                      </div>

                      {/* Improved description */}
                      {result.improvedDescription && (
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm text-white/80 leading-relaxed flex-1">
                              {result.improvedDescription}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono flex-shrink-0 mt-0.5">
                              {result.improvedDescription.length}/90
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
