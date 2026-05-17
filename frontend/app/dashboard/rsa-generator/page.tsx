"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Copy, Download, Check, Globe, Target, Sparkles,
  AlertTriangle, ChevronDown, ArrowRight, ExternalLink,
  RotateCcw, Shield, Info, Megaphone, TrendingUp, Search, Brain,
  Monitor, Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RSAFullResult, RSAHeadline, RSADescription } from "@/lib/mock-data";
import { generateRSA } from "@/lib/fake-ai/rsa-generator";
import { useT, interp } from "@/lib/i18n";

// ─── Options ────────────────────────────────────────────────────────────────

type CountryEntry = { code: string; name: string; flag: string; group: "cis" | "popular" | "other" };

const GROUP_LABELS: Record<"cis" | "popular" | "other", string> = {
  cis:     "CIS & Eastern Europe",
  popular: "Popular Markets",
  other:   "More Countries",
};

const COUNTRIES: CountryEntry[] = [
  // ── CIS & Eastern Europe — shown first for CIS marketers ──
  { code: "RU",  name: "Russia",          flag: "🇷🇺", group: "cis" },
  { code: "UA",  name: "Ukraine",         flag: "🇺🇦", group: "cis" },
  { code: "KZ",  name: "Kazakhstan",      flag: "🇰🇿", group: "cis" },
  { code: "BY",  name: "Belarus",         flag: "🇧🇾", group: "cis" },
  { code: "UZ",  name: "Uzbekistan",      flag: "🇺🇿", group: "cis" },
  { code: "AZ",  name: "Azerbaijan",      flag: "🇦🇿", group: "cis" },
  { code: "AM",  name: "Armenia",         flag: "🇦🇲", group: "cis" },
  { code: "GE",  name: "Georgia",         flag: "🇬🇪", group: "cis" },
  { code: "MD",  name: "Moldova",         flag: "🇲🇩", group: "cis" },
  { code: "KG",  name: "Kyrgyzstan",      flag: "🇰🇬", group: "cis" },
  { code: "TJ",  name: "Tajikistan",      flag: "🇹🇯", group: "cis" },
  { code: "CIS", name: "CIS Region",      flag: "🌐",  group: "cis" },
  { code: "CEE", name: "Eastern Europe",  flag: "🌍",  group: "cis" },

  // ── Popular ad markets (high Google Ads spend globally) ──
  { code: "US", name: "United States",  flag: "🇺🇸", group: "popular" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", group: "popular" },
  { code: "DE", name: "Germany",        flag: "🇩🇪", group: "popular" },
  { code: "AU", name: "Australia",      flag: "🇦🇺", group: "popular" },
  { code: "CA", name: "Canada",         flag: "🇨🇦", group: "popular" },
  { code: "FR", name: "France",         flag: "🇫🇷", group: "popular" },
  { code: "NL", name: "Netherlands",    flag: "🇳🇱", group: "popular" },
  { code: "CH", name: "Switzerland",    flag: "🇨🇭", group: "popular" },
  { code: "AE", name: "UAE",            flag: "🇦🇪", group: "popular" },
  { code: "SG", name: "Singapore",      flag: "🇸🇬", group: "popular" },

  // ── More countries ──
  { code: "ES", name: "Spain",     flag: "🇪🇸", group: "other" },
  { code: "IT", name: "Italy",     flag: "🇮🇹", group: "other" },
  { code: "BR", name: "Brazil",    flag: "🇧🇷", group: "other" },
  { code: "IN", name: "India",     flag: "🇮🇳", group: "other" },
  { code: "JP", name: "Japan",     flag: "🇯🇵", group: "other" },
  { code: "MX", name: "Mexico",    flag: "🇲🇽", group: "other" },
  { code: "PL", name: "Poland",    flag: "🇵🇱", group: "other" },
  { code: "SE", name: "Sweden",    flag: "🇸🇪", group: "other" },
  { code: "NO", name: "Norway",    flag: "🇳🇴", group: "other" },
  { code: "DK", name: "Denmark",   flag: "🇩🇰", group: "other" },
];

const LANGUAGES = [
  "English", "Russian", "Spanish", "French", "German", "Portuguese",
  "Italian", "Dutch", "Japanese", "Korean", "Chinese (Simplified)",
  "Arabic", "Polish", "Swedish", "Norwegian", "Danish",
];

type Tab = "headlines" | "descriptions" | "cta" | "moderation";

// ─── Sub-components ──────────────────────────────────────────────────────────

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { code: string; name: string; flag: string })[];
  placeholder: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all cursor-pointer hover:border-white/[0.12]"
        >
          <option value="" className="bg-[#0d0d14] text-white/40">
            {placeholder}
          </option>
          {options.map((o) => {
            const key = typeof o === "string" ? o : o.code;
            const label = typeof o === "string" ? o : `${o.flag}  ${o.name}`;
            return (
              <option key={key} value={key} className="bg-[#0d0d14] text-white">
                {label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── CountrySelect ────────────────────────────────────────────────────────────

function CountrySelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: CountryEntry[];
  placeholder: string;
  icon?: React.ElementType;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState({
    top: 0, bottom: 0, left: 0, width: 0, maxListHeight: 256, openUpward: false,
  });

  const selected = options.find((o) => o.code === value);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      const openUpward = spaceAbove > spaceBelow && spaceBelow < 200;
      const availableSpace = openUpward ? spaceAbove : spaceBelow;
      const maxListHeight = Math.min(280, Math.max(120, availableSpace - 52));
      setPos({
        top: rect.bottom + 6,
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
        width: rect.width,
        maxListHeight,
        openUpward,
      });
    }
    setOpen(true);
    setSearch("");
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleClose = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current  && !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Close on scroll/resize — but not when scrolling inside the dropdown itself
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      handleClose();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const q = search.toLowerCase();
  const filtered = q
    ? options.filter((o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q))
    : options;

  const groups: { key: "cis" | "popular" | "other"; items: CountryEntry[] }[] = [
    { key: "cis" as const,     items: filtered.filter((o) => o.group === "cis")     },
    { key: "popular" as const, items: filtered.filter((o) => o.group === "popular") },
    { key: "other" as const,   items: filtered.filter((o) => o.group === "other")   },
  ].filter((g) => g.items.length > 0);

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: pos.openUpward ? 6 : -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: pos.openUpward ? 6 : -6, scale: 0.97 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          style={
            pos.openUpward
              ? { position: "fixed" as const, bottom: pos.bottom, top: "auto", left: pos.left, width: pos.width, zIndex: 9999 }
              : { position: "fixed" as const, top: pos.top, bottom: "auto", left: pos.left, width: pos.width, zIndex: 9999 }
          }
          className="rounded-xl border border-white/[0.1] bg-[#0d0d14] shadow-2xl shadow-black/70 overflow-hidden"
        >
          {/* Search input */}
          <div className="p-2 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.06] text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Grouped list */}
          <div
            className="overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
            style={{ maxHeight: pos.maxListHeight }}
          >
            {groups.length === 0 ? (
              <p className="px-4 py-6 text-xs text-white/25 text-center">No results</p>
            ) : (
              groups.map(({ key, items }) => (
                <div key={key}>
                  <div className="sticky top-0 px-3 pt-2.5 pb-1 text-[9px] font-bold uppercase tracking-widest text-white/25 bg-[#0d0d14]">
                    {GROUP_LABELS[key]}
                  </div>
                  {items.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => { onChange(country.code); handleClose(); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors duration-100",
                        value === country.code
                          ? "bg-indigo-500/[0.12] text-indigo-300 hover:bg-indigo-500/[0.18]"
                          : "text-white/70 hover:bg-white/[0.07] hover:text-white/90 active:bg-white/[0.09]"
                      )}
                    >
                      <span className="text-base leading-none w-5 text-center flex-shrink-0">{country.flag}</span>
                      <span className="text-sm leading-none flex-1 min-w-0 truncate">{country.name}</span>
                      {value === country.code && <Check className="w-3 h-3 flex-shrink-0 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        onClick={open ? handleClose : handleOpen}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all cursor-pointer",
          open
            ? "border-indigo-500/40 ring-1 ring-indigo-500/15 bg-white/[0.04]"
            : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.12]",
          !selected ? "text-white/30" : "text-white"
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-base leading-none flex-shrink-0">{selected.flag}</span>
            <span className="text-sm truncate">{selected.name}</span>
          </span>
        ) : (
          <span className="truncate">{placeholder}</span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5 text-white/25" />
        </motion.span>
      </button>
      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}

function CharCount({ text, limit }: { text: string; limit: number }) {
  const n = text.length;
  const over = n > limit;
  const warn = !over && n > limit * 0.9;
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md flex-shrink-0",
        over
          ? "bg-red-500/15 text-red-400"
          : warn
          ? "bg-amber-500/15 text-amber-400"
          : "bg-white/[0.05] text-white/22"
      )}
    >
      {n}/{limit}
    </span>
  );
}

function StrengthBadge({ strength, label }: { strength: RSAHeadline["strength"]; label: string }) {
  const map = {
    excellent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    good:      "bg-blue-500/10    text-blue-400    border-blue-500/20",
    average:   "bg-amber-500/10   text-amber-400   border-amber-500/20",
    weak:      "bg-red-500/10     text-red-400     border-red-500/20",
  };
  return (
    <span
      className={cn(
        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border flex-shrink-0",
        map[strength]
      )}
    >
      {label}
    </span>
  );
}

function CopyBtn({
  text,
  id,
  copiedId,
  onCopy,
}: {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  const done = copiedId === id;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onCopy(id, text)}
      className={cn(
        "flex-shrink-0 p-1.5 rounded-lg transition-all",
        done
          ? "bg-emerald-500/15 text-emerald-400"
          : "text-white/20 hover:text-white/60 hover:bg-white/[0.06]"
      )}
    >
      {done ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </motion.button>
  );
}

// Google SERP-style ad preview with desktop/mobile toggle
function AdPreview({
  headlines,
  descriptions,
  niche,
  previewTitle,
}: {
  headlines: RSAHeadline[];
  descriptions: RSADescription[];
  niche: string;
  previewTitle: string;
}) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  const h1 = headlines[0]?.text ?? "Headline One";
  const h2 = headlines[1]?.text ?? "Headline Two";
  const h3 = headlines[2]?.text ?? "Headline Three";
  const desc  = descriptions[0]?.text ?? "";
  const desc2 = descriptions[1]?.text ?? "";
  const slug = niche.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 18) || "yourbusiness";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-2">
          <ExternalLink className="w-3 h-3" />
          {previewTitle}
        </p>
        {/* View toggle */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => setView("desktop")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
              view === "desktop"
                ? "bg-white/[0.08] text-white/70"
                : "text-white/25 hover:text-white/45"
            )}
          >
            <Monitor className="w-3 h-3" />
            Desktop
          </button>
          <button
            onClick={() => setView("mobile")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
              view === "mobile"
                ? "bg-white/[0.08] text-white/70"
                : "text-white/25 hover:text-white/45"
            )}
          >
            <Smartphone className="w-3 h-3" />
            Mobile
          </button>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {view === "desktop" ? (
            <motion.div
              key="desktop"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl bg-[#18181f] border border-white/[0.06] p-4 space-y-1.5"
            >
              {/* Domain row */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-white/50 leading-none">{slug}.com</p>
                  <p className="text-[10px] text-white/25">{slug}.com › ads › landing-page</p>
                </div>
                <span className="ml-auto text-[9px] border border-white/20 text-white/30 px-1.5 py-0.5 rounded font-medium">
                  Sponsored
                </span>
              </div>
              {/* Headline */}
              <p className="text-[17px] font-medium text-[#8ab4f8] leading-snug cursor-pointer hover:underline">
                {h1} | {h2} | {h3}
              </p>
              {/* Description */}
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="mx-auto max-w-[320px]"
            >
              {/* Mobile SERP chrome */}
              <div className="rounded-2xl bg-[#18181f] border border-white/[0.06] overflow-hidden">
                {/* Search bar simulation */}
                <div className="px-3 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
                  <div className="flex-1 h-7 rounded-full bg-white/[0.06] border border-white/[0.07] flex items-center px-3 gap-2">
                    <Search className="w-2.5 h-2.5 text-white/20 flex-shrink-0" />
                    <span className="text-[10px] text-white/20 truncate">{niche.slice(0, 24)}</span>
                  </div>
                </div>
                {/* Ad card */}
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/45 leading-none truncate">{slug}.com</p>
                    </div>
                    <span className="ml-auto text-[8px] border border-white/15 text-white/25 px-1 py-0.5 rounded font-medium flex-shrink-0">
                      Sponsored
                    </span>
                  </div>
                  <p className="text-[15px] font-medium text-[#8ab4f8] leading-snug">
                    {h1} | {h2}
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                  {/* Sitelinks simulation */}
                  {desc2 && (
                    <div className="pt-1.5 flex gap-2 flex-wrap">
                      {[h3].map((hl, i) => (
                        <span key={i} className="text-[10px] text-[#8ab4f8] border-b border-[#8ab4f8]/30 cursor-pointer hover:border-[#8ab4f8]/60">
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Empty state
function EmptyState() {
  const r = useT().rsa;
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.01] flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/10 flex items-center justify-center">
          <Zap className="w-7 h-7 text-indigo-500/30" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400/60" />
        </div>
      </div>
      <p className="text-white/50 font-semibold text-base mb-2">
        {r.emptyTitle}
      </p>
      <p className="text-white/22 text-sm max-w-sm leading-relaxed">
        {r.emptySubtitle}
      </p>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-8">
        {r.whatYouGet.map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-xs text-white/18"
            >
              <div className="w-1 h-1 rounded-full bg-indigo-500/30" />
              {item}
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

// Loading state — premium AI generation flow
function LoadingState({
  step,
  progress,
  title,
  subtitle,
  steps,
}: {
  step: number;
  progress: number;
  title: string;
  subtitle: string;
  steps: string[];
}) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-indigo-500/[0.12] bg-white/[0.02] overflow-hidden"
      style={{ boxShadow: "0 0 60px -12px rgba(99,102,241,0.15)" }}
    >
      {/* Top glow stripe */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="p-7">
        {/* AI orb + title */}
        <div className="flex items-center gap-5 mb-8">
          {/* Layered pulse orb */}
          <div className="relative flex-shrink-0">
            {/* outer pulse ring 1 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-500/10"
              animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ margin: "-10px" }}
            />
            {/* outer pulse ring 2 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/8"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              style={{ margin: "-6px" }}
            />
            {/* core orb */}
            <motion.div
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
              animate={{ boxShadow: [
                "0 0 20px 4px rgba(99,102,241,0.35)",
                "0 0 32px 8px rgba(139,92,246,0.45)",
                "0 0 20px 4px rgba(99,102,241,0.35)",
              ]}}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* rotating arc */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{ borderTopColor: "rgba(255,255,255,0.35)", borderRightColor: "rgba(255,255,255,0.1)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="w-5 h-5 text-white" fill="white" />
            </motion.div>
          </div>

          <div>
            <motion.p
              className="text-base font-bold text-white leading-tight"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {title}
            </motion.p>
            <p className="text-xs text-indigo-400/70 mt-0.5 font-medium">{subtitle}</p>
          </div>

          <div className="ml-auto">
            <span className="text-2xl font-black tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-7">
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)" }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2.5 mb-8">
          {steps.map((s, i) => {
            const done    = i < step;
            const active  = i === step;
            const pending = i > step;
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: pending ? 0.22 : 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* indicator */}
                <div className="relative flex-shrink-0">
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-indigo-500/30"
                      animate={{ scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      style={{ margin: "-3px" }}
                    />
                  )}
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                    done    ? "bg-emerald-500/20 border border-emerald-500/30"
                    : active ? "bg-indigo-500/20 border border-indigo-500/40"
                    :          "bg-white/[0.04] border border-white/[0.08]"
                  )}>
                    {done ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : active ? (
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                    )}
                  </div>
                </div>

                <span className={cn(
                  "text-sm transition-all duration-300 flex-1",
                  done    ? "text-white/30 line-through decoration-white/15"
                  : active ? "text-white font-semibold"
                  :          "text-white/22"
                )}>
                  {s}
                </span>

                {done && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] text-emerald-400/60 font-mono flex-shrink-0"
                  >
                    done
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Skeleton rows — shimmer */}
        <div className="space-y-2.5">
          {[85, 65, 75, 55, 80].map((w, i) => (
            <div
              key={i}
              className="h-9 rounded-xl overflow-hidden relative"
              style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-white/[0.03] rounded-xl" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.18,
                  repeatDelay: 0.3,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom glow stripe */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function RSAGeneratorPage() {
  const t = useT();
  const r = t.rsa; // shorthand

  const [form, setForm] = useState({
    niche: "",
    country: "",
    language: "",
    goal: "",
    tone: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [results, setResults] = useState<RSAFullResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("headlines");

  const isValid =
    form.niche.trim().length > 8 &&
    !!form.country &&
    !!form.language &&
    !!form.goal &&
    !!form.tone;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /** Call the server-side AI route; fall back to rule-based generator on any error. */
  const fetchRSAResult = async (): Promise<RSAFullResult> => {
    try {
      const res = await fetch("/api/ai/rsa-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche:       form.niche,
          countryCode: form.country,
          language:    form.language,
          goal:        form.goal,
          tone:        form.tone,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: unknown = await res.json();
      // Reject if server returned an error payload
      if (
        typeof data === "object" && data !== null &&
        "error" in data && typeof (data as Record<string, unknown>).error === "string"
      ) {
        throw new Error((data as Record<string, unknown>).error as string);
      }

      // Basic shape validation before trusting the response
      const d = data as Partial<RSAFullResult>;
      if (!Array.isArray(d.headlines) || d.headlines.length === 0) {
        throw new Error("Invalid response shape");
      }

      return data as RSAFullResult;
    } catch (e) {
      console.warn("[rsa-generator] ⚠️  API failed, using local fallback:", (e as Error).message);
      return generateRSA(form.niche, form.country, form.language, form.goal, form.tone);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResults(null);
    setLoadingStep(0);
    setLoadingProgress(0);
    setActiveTab("headlines");

    // Per-step durations (ms) — heavier steps feel slower
    const STEP_MS = [420, 380, 340, 600, 420, 360];
    const total = r.loadingSteps.length;

    // Kick off the API call in parallel with the animation
    const resultPromise = fetchRSAResult();

    for (let i = 0; i < total; i++) {
      setLoadingStep(i);
      setLoadingProgress(Math.round((i / total) * 92));
      await new Promise((res) => setTimeout(res, STEP_MS[i] ?? 370));
    }

    // Snap to 100% briefly, then await the result
    setLoadingStep(total);
    setLoadingProgress(100);
    await new Promise((res) => setTimeout(res, 220));

    const result = await resultPromise;
    setResults(result);
    setLoading(false);
  };

  const handleCopyAll = () => {
    if (!results) return;
    const out = [
      "=== HEADLINES ===",
      ...results.headlines.map((h, i) => `${i + 1}. ${h.text}`),
      "",
      "=== DESCRIPTIONS ===",
      ...results.descriptions.map((d, i) => `${i + 1}. ${d.text}`),
      "",
      "=== CTA SUGGESTIONS ===",
      ...results.ctaSuggestions.map((c, i) => `${i + 1}. ${c}`),
    ].join("\n");
    handleCopy("__all__", out);
  };

  const riskStyle = {
    LOW:    { dot: "bg-emerald-400", pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500" },
    MEDIUM: { dot: "bg-amber-400",   pill: "bg-amber-500/10  text-amber-400   border-amber-500/20",   bar: "bg-amber-500"   },
    HIGH:   { dot: "bg-red-400",     pill: "bg-red-500/10    text-red-400     border-red-500/20",     bar: "bg-red-500"     },
  };

  const severityStyle = {
    low:    "bg-amber-500/10  text-amber-400  border-amber-500/20",
    medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    high:   "bg-red-500/10    text-red-400    border-red-500/20",
  };

  const tabs: { key: Tab; label: string }[] = results
    ? [
        { key: "headlines",    label: r.tabHeadlines.replace("{n}", String(results.headlines.length)) },
        { key: "descriptions", label: r.tabDescriptions.replace("{n}", String(results.descriptions.length)) },
        { key: "cta",          label: r.tabCta },
        { key: "moderation",   label: r.tabModeration },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-[22px] font-black text-white tracking-tight leading-none mb-1">
              {r.pageTitle}
            </h1>
            <p className="text-sm text-white/30">{r.pageSubtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 items-start">

        {/* ── LEFT: Input panel ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="xl:sticky xl:top-6"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
            {/* panel header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <p className="text-xs font-bold text-white/45 uppercase tracking-widest">
                {r.panelTitle}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Niche */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">
                  <Sparkles className="w-3 h-3" />
                  {r.nicheLabel}
                  <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  value={form.niche}
                  onChange={(e) => setForm({ ...form, niche: e.target.value })}
                  placeholder={r.nichePlaceholder}
                  rows={5}
                  className="w-full px-3.5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-white/18 text-sm focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all resize-none leading-relaxed"
                />
                <p className="text-[11px] text-white/20 mt-1.5 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {r.nicheHint}
                </p>
              </div>

              {/* Country + Language */}
              <div className="grid grid-cols-2 gap-3">
                <CountrySelect
                  label={r.countryLabel}
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                  options={COUNTRIES}
                  placeholder={r.countryPlaceholder}
                  icon={Globe}
                />
                <SelectField
                  label={r.languageLabel}
                  value={form.language}
                  onChange={(v) => setForm({ ...form, language: v })}
                  options={LANGUAGES}
                  placeholder={r.languagePlaceholder}
                />
              </div>

              {/* Goal + Tone */}
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label={r.goalLabel}
                  value={form.goal}
                  onChange={(v) => setForm({ ...form, goal: v })}
                  options={r.goals}
                  placeholder={r.goalPlaceholder}
                  icon={Target}
                />
                <SelectField
                  label={r.toneLabel}
                  value={form.tone}
                  onChange={(v) => setForm({ ...form, tone: v })}
                  options={r.tones}
                  placeholder={r.tonePlaceholder}
                  icon={Megaphone}
                />
              </div>

              {/* Form completeness indicator */}
              <div className="flex items-center gap-1.5">
                {(["niche", "country", "language", "goal", "tone"] as const).map(
                  (field) => (
                    <div
                      key={field}
                      className={cn(
                        "flex-1 h-0.5 rounded-full transition-all duration-300",
                        field === "niche"
                          ? form.niche.trim().length > 8
                            ? "bg-indigo-500"
                            : "bg-white/[0.07]"
                          : form[field]
                          ? "bg-indigo-500"
                          : "bg-white/[0.07]"
                      )}
                    />
                  )
                )}
              </div>
              {!isValid && (
                <p className="text-[11px] text-white/20 text-center -mt-1">
                  {5 -
                    [
                      form.niche.trim().length > 8,
                      !!form.country,
                      !!form.language,
                      !!form.goal,
                      !!form.tone,
                    ].filter(Boolean).length}{" "}
                  field
                  {5 -
                    [
                      form.niche.trim().length > 8,
                      !!form.country,
                      !!form.language,
                      !!form.goal,
                      !!form.tone,
                    ].filter(Boolean).length ===
                  1
                    ? ""
                    : "s"}{" "}
                  remaining
                </p>
              )}

              {/* Generate button */}
              <motion.button
                whileHover={isValid && !loading ? { scale: 1.015 } : {}}
                whileTap={isValid && !loading ? { scale: 0.985 } : {}}
                onClick={handleGenerate}
                disabled={loading || !isValid}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all",
                  isValid && !loading
                    ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer"
                    : "bg-white/[0.05] text-white/25 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {r.generatingBtn}
                  </>
                ) : (
                  <>
                    <Zap
                      className="w-4 h-4"
                      fill={isValid ? "white" : "none"}
                    />
                    {r.generateBtn}
                    <ArrowRight className="w-4 h-4 ml-auto opacity-60" />
                  </>
                )}
              </motion.button>

              {/* What you get */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { icon: TrendingUp, label: r.whatYouGet[0] },
                  { icon: Zap,        label: r.whatYouGet[1] },
                  { icon: Target,     label: r.whatYouGet[2] },
                  { icon: Shield,     label: r.whatYouGet[3] },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs text-white/25"
                  >
                    <Icon className="w-3 h-3 text-indigo-500/40" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Results panel ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 min-h-[500px]"
        >
          <AnimatePresence mode="wait">

            {/* EMPTY */}
            {!loading && !results && <EmptyState key="empty" />}

            {/* LOADING */}
            {loading && (
              <LoadingState
                key="loading"
                step={loadingStep}
                progress={loadingProgress}
                title={r.loadingTitle}
                subtitle={r.loadingSubtitle}
                steps={r.loadingSteps as string[]}
              />
            )}

            {/* RESULTS */}
            {!loading && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-4"
              >
                {/* Results toolbar */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-white/50 font-medium">
                      {interp(r.generatedLabel, {
                        h: results.headlines.length,
                        d: results.descriptions.length,
                      })}
                    </span>
                    <span className="text-xs text-white/22 hidden sm:inline">
                      {results.generatedAt}
                    </span>
                    {results.aiMode && (
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        results.aiMode === "openai"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", results.aiMode === "openai" ? "bg-emerald-400 animate-pulse" : "bg-amber-400")} />
                        {results.aiMode === "openai" ? r.aiModeOpenAI : r.aiModeFallback}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleCopyAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs text-white/45 hover:text-white hover:border-white/20 transition-all"
                    >
                      {copiedId === "__all__" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {r.copyAllBtn}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs text-white/45 hover:text-white hover:border-white/20 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {r.exportBtn}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/8 text-xs text-indigo-400 hover:bg-indigo-500/18 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {r.regenerateBtn}
                    </motion.button>
                  </div>
                </div>

                {/* AI strategy note — shown only when OpenAI generated the result */}
                {results.strategyNote && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3.5 rounded-xl border border-violet-500/20 bg-violet-500/6"
                  >
                    <Brain className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/55 leading-relaxed">
                      {results.strategyNote}
                    </p>
                  </motion.div>
                )}

                {/* Ad preview */}
                <AdPreview
                  headlines={results.headlines}
                  descriptions={results.descriptions}
                  niche={form.niche}
                  previewTitle={r.previewTitle}
                />

                {/* Tab bar */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                  {tabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        "flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all",
                        activeTab === key
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-white/28 hover:text-white/55"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">

                  {/* ── HEADLINES ── */}
                  {activeTab === "headlines" && (
                    <motion.div
                      key="tab-headlines"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                    >
                      {/* header */}
                      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
                          {r.headlinesHeader}
                        </p>
                        <div className="flex items-center gap-3 text-[9px] text-white/20 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {r.strengthLabels.excellent}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                            {r.strengthLabels.good}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            {r.strengthLabels.average}
                          </span>
                        </div>
                      </div>

                      {/* rows */}
                      <div className="divide-y divide-white/[0.04]">
                        {results.headlines.map((h, i) => (
                          <motion.div
                            key={h.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.035, duration: 0.3 }}
                            className="flex items-center gap-3 px-5 py-3 group hover:bg-white/[0.025] transition-colors"
                          >
                            <span className="text-[11px] font-bold text-white/18 w-6 text-right flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="flex-1 text-sm text-white/80 leading-snug">
                              {h.text}
                            </span>
                            {/* always visible */}
                            <CharCount text={h.text} limit={30} />
                            {/* on hover */}
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <StrengthBadge strength={h.strength} label={r.strengthLabels[h.strength]} />
                              <CopyBtn
                                text={h.text}
                                id={`h-${h.id}`}
                                copiedId={copiedId}
                                onCopy={handleCopy}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── DESCRIPTIONS ── */}
                  {activeTab === "descriptions" && (
                    <motion.div
                      key="tab-descriptions"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                    >
                      <div className="px-5 py-3.5 border-b border-white/[0.06]">
                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
                          {r.descriptionsHeader}
                        </p>
                      </div>
                      <div className="p-5 space-y-3">
                        {results.descriptions.map((d, i) => (
                          <motion.div
                            key={d.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-[11px] font-bold text-white/18 mt-0.5 flex-shrink-0 w-4">
                                {i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/80 leading-relaxed mb-2.5">
                                  {d.text}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <StrengthBadge strength={d.strength} label={r.strengthLabels[d.strength]} />
                                  <CharCount text={d.text} limit={90} />
                                  {d.tip && (
                                    <span className="text-[10px] text-white/22 flex items-center gap-1">
                                      <Info className="w-2.5 h-2.5 flex-shrink-0" />
                                      {d.tip}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <CopyBtn
                                text={d.text}
                                id={`d-${d.id}`}
                                copiedId={copiedId}
                                onCopy={handleCopy}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── CTA IDEAS ── */}
                  {activeTab === "cta" && (
                    <motion.div
                      key="tab-cta"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
                    >
                      <div className="px-5 py-3.5 border-b border-white/[0.06]">
                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
                          {r.ctaTabHeader}
                        </p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-white/28 mb-5 leading-relaxed">
                          {r.ctaTabDesc}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {results.ctaSuggestions.map((cta, i) => (
                            <motion.button
                              key={cta}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.04 }}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleCopy(`cta-${i}`, cta)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all",
                                copiedId === `cta-${i}`
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                  : "border-white/[0.1] bg-white/[0.03] text-white/65 hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:text-indigo-300"
                              )}
                            >
                              {copiedId === `cta-${i}` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-40" />
                              )}
                              {cta}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── RISK CHECK ── */}
                  {activeTab === "moderation" && (
                    <motion.div
                      key="tab-moderation"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-4"
                    >
                      {/* Score card */}
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
                            {r.moderationHeader}
                          </p>
                          <div
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold",
                              riskStyle[results.moderation.level].pill
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                riskStyle[results.moderation.level].dot
                              )}
                            />
                            {r.riskLabels[results.moderation.level.toLowerCase() as keyof typeof r.riskLabels]}
                          </div>
                        </div>

                        <div className="flex items-end gap-5">
                          <div>
                            <p className="text-6xl font-black text-white leading-none">
                              {results.moderation.score}
                            </p>
                            <p className="text-xs text-white/28 mt-1.5">
                              {r.safetyScoreLabel}
                            </p>
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${results.moderation.score}%`,
                                }}
                                transition={{ duration: 0.9, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full",
                                  riskStyle[results.moderation.level].bar
                                )}
                              />
                            </div>
                            <p className="text-[10px] text-white/20 mt-1.5">
                              {r.safetyBarHint}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.06]">
                          <div className="text-center">
                            <p className="text-lg font-bold text-white">
                              {results.headlines.length -
                                results.moderation.flags.length}
                            </p>
                            <p className="text-[10px] text-white/28 mt-0.5">
                              {r.safeHeadlinesLabel}
                            </p>
                          </div>
                          <div className="w-px h-8 bg-white/[0.07]" />
                          <div className="text-center">
                            <p className="text-lg font-bold text-amber-400">
                              {results.moderation.flags.length}
                            </p>
                            <p className="text-[10px] text-white/28 mt-0.5">
                              {r.flaggedIssuesLabel}
                            </p>
                          </div>
                          <div className="w-px h-8 bg-white/[0.07]" />
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-400">
                              {results.moderation.flags.length}
                            </p>
                            <p className="text-[10px] text-white/28 mt-0.5">
                              {r.aiFixesLabel}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* All clear */}
                      {results.moderation.flags.length === 0 && (
                        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-emerald-400" />
                          </div>
                          <p className="text-emerald-400 font-semibold">
                            {r.allClearTitle}
                          </p>
                          <p className="text-emerald-400/45 text-sm mt-1">
                            {r.allClearSub}
                          </p>
                        </div>
                      )}

                      {/* Flags */}
                      {results.moderation.flags.length > 0 && (
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">
                              {interp(r.issuesFoundLabel, { n: results.moderation.flags.length })}
                            </p>
                          </div>
                          <div className="divide-y divide-white/[0.04]">
                            {results.moderation.flags.map((flag, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="p-5"
                              >
                                {/* original */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white/80 truncate">
                                      &ldquo;{flag.field}&rdquo;
                                    </p>
                                    <p className="text-xs text-white/35 mt-1 leading-relaxed">
                                      {flag.issue}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border flex-shrink-0",
                                      severityStyle[flag.severity]
                                    )}
                                  >
                                    {r.severityLabels[flag.severity]}
                                  </span>
                                </div>
                                {/* safer alternative */}
                                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                  <p className="text-[9px] font-bold text-emerald-400/50 uppercase tracking-widest mb-1.5">
                                    {r.saferAltLabel}
                                  </p>
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm text-emerald-400 font-medium">
                                      &ldquo;{flag.safer}&rdquo;
                                    </p>
                                    <CopyBtn
                                      text={flag.safer}
                                      id={`safer-${i}`}
                                      copiedId={copiedId}
                                      onCopy={handleCopy}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
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
