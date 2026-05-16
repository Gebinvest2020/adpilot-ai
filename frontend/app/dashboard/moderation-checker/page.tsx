"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, AlertTriangle, Wand2,
} from "lucide-react";
import { moderationResults } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useT, interp } from "@/lib/i18n";

const severityConfig = {
  high:   { color: "text-red-400 bg-red-500/10 border-red-500/20",     icon: AlertCircle },
  medium: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
  low:    { color: "text-blue-400 bg-blue-500/10 border-blue-500/20",   icon: AlertCircle },
};

function RiskRing({ score, labelLow, labelMedium, labelHigh }: {
  score: number;
  labelLow: string;
  labelMedium: string;
  labelHigh: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const riskColor = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
  const riskLabel = score >= 70 ? labelHigh : score >= 40 ? labelMedium : labelLow;
  const riskTextColor = score >= 70 ? "text-red-400" : score >= 40 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90">
          <circle cx="72" cy="72" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="72" cy="72" r={radius}
            stroke={riskColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${riskColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-black text-white"
          >
            {score}
          </motion.span>
          <span className="text-xs text-white/30 font-medium">/ 100</span>
        </div>
      </div>
      <div className={cn("px-4 py-1.5 rounded-full text-sm font-bold", riskTextColor,
        score >= 70 ? "bg-red-500/10" : score >= 40 ? "bg-amber-500/10" : "bg-emerald-500/10"
      )}>
        {riskLabel}
      </div>
    </div>
  );
}

export default function ModerationCheckerPage() {
  const t = useT();
  const m = t.moderation;

  const [headlines, setHeadlines] = useState([""]);
  const [descriptions, setDescriptions] = useState([""]);
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof moderationResults | null>(null);

  const addHeadline = () => headlines.length < 15 && setHeadlines([...headlines, ""]);
  const removeHeadline = (i: number) => setHeadlines(headlines.filter((_, idx) => idx !== i));
  const updateHeadline = (i: number, val: string) => {
    const n = [...headlines]; n[i] = val; setHeadlines(n);
  };

  const addDescription = () => descriptions.length < 4 && setDescriptions([...descriptions, ""]);
  const removeDescription = (i: number) => setDescriptions(descriptions.filter((_, idx) => idx !== i));
  const updateDescription = (i: number, val: string) => {
    const n = [...descriptions]; n[i] = val; setDescriptions(n);
  };

  const handleCheck = async () => {
    setLoading(true);
    setResults(null);
    await new Promise((r) => setTimeout(r, 1800));
    setResults(moderationResults);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">{m.pageTitle}</h1>
        </div>
        <p className="text-sm text-white/40 ml-12">{m.pageSubtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-6 h-fit"
        >
          {/* Headlines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                {m.headlinesLabel} <span className="text-white/25 normal-case tracking-normal font-normal">({headlines.length}/15)</span>
              </label>
              <button onClick={addHeadline} disabled={headlines.length >= 15}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors">
                <Plus className="w-3 h-3" /> {m.addBtn}
              </button>
            </div>
            <div className="space-y-2">
              {headlines.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 w-4">{i + 1}</span>
                  <input
                    value={h}
                    onChange={(e) => updateHeadline(i, e.target.value)}
                    placeholder={`${m.headlinesLabel} ${i + 1}...`}
                    maxLength={30}
                    className="flex-1 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/40 transition-all"
                  />
                  <span className="text-[10px] text-white/25 w-8 text-right">{h.length}/30</span>
                  {headlines.length > 1 && (
                    <button onClick={() => removeHeadline(i)} className="text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                {m.descriptionsLabel} <span className="text-white/25 normal-case tracking-normal font-normal">({descriptions.length}/4)</span>
              </label>
              <button onClick={addDescription} disabled={descriptions.length >= 4}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors">
                <Plus className="w-3 h-3" /> {m.addBtn}
              </button>
            </div>
            <div className="space-y-2">
              {descriptions.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-white/20 w-4 mt-2.5">{i + 1}</span>
                  <textarea
                    value={d}
                    onChange={(e) => updateDescription(i, e.target.value)}
                    placeholder={`${m.descriptionsLabel} ${i + 1}...`}
                    maxLength={90}
                    rows={2}
                    className="flex-1 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/40 transition-all resize-none"
                  />
                  <span className="text-[10px] text-white/25 w-8 text-right mt-2.5">{d.length}/90</span>
                  {descriptions.length > 1 && (
                    <button onClick={() => removeDescription(i)} className="text-white/20 hover:text-red-400 transition-colors mt-2">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">{m.industryLabel}</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
            >
              <option value="" className="bg-[#111118]">{m.industryPlaceholder}</option>
              {m.industries.map((ind) => (
                <option key={ind} value={ind} className="bg-[#111118]">{ind}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 disabled:opacity-60 transition-all"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{m.checkingBtn}</>
            ) : (
              <><Shield className="w-4 h-4" />{m.checkBtn}</>
            )}
          </motion.button>
        </motion.div>

        {/* RIGHT — Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 animate-pulse space-y-4">
                <div className="w-32 h-32 rounded-full bg-white/[0.04] mx-auto" />
                <div className="space-y-3 mt-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/[0.03] rounded-xl" />)}
                </div>
              </motion.div>
            )}

            {!loading && !results && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-16 text-center">
                <Shield className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 text-sm font-medium">{m.emptyMsg}</p>
              </motion.div>
            )}

            {!loading && results && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Score overview */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <RiskRing
                      score={results.overallRisk}
                      labelLow={m.riskLow}
                      labelMedium={m.riskMedium}
                      labelHigh={m.riskHigh}
                    />
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-sm font-bold text-white">{m.complianceTitle}</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {interp(m.issuesFoundDesc, {
                          flagged: String(results.flaggedItems.length),
                          safe: String(results.safeItems.length),
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-medium">
                          {results.flaggedItems.filter(f => f.severity === "high").length} {m.highLabel}
                        </span>
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
                          {results.flaggedItems.filter(f => f.severity === "medium").length} {m.mediumLabel}
                        </span>
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
                          {results.flaggedItems.filter(f => f.severity === "low").length} {m.lowLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flagged items */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{m.issuesLabel}</p>
                  {results.flaggedItems.map((flag, i) => {
                    const cfg = severityConfig[flag.severity];
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("rounded-xl border p-4 space-y-2", cfg.color)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-bold">{flag.type}</span>
                          <span className="text-[10px] uppercase tracking-wide opacity-70">{flag.severity}</span>
                        </div>
                        <p className="text-xs opacity-70 leading-relaxed">
                          <span className="font-mono bg-white/[0.08] px-1 rounded">&quot;{flag.item}&quot;</span>
                          {" "}{flag.explanation}
                        </p>
                        <p className="text-xs opacity-80 font-medium">
                          ✦ {flag.suggestion}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Safe items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{m.compliantLabel}</p>
                  {results.safeItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white/60">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Fix button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/8 hover:bg-indigo-500/15 text-indigo-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  {m.fixBtn}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
