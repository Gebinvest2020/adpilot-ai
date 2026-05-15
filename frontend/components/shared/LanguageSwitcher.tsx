"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGUAGES: { locale: Locale; flag: string; label: string; short: string }[] = [
  { locale: "en", flag: "🇺🇸", label: "English", short: "EN" },
  { locale: "ru", flag: "🇷🇺", label: "Русский", short: "RU" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.locale === locale) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border transition-all duration-200",
          open
            ? "border-indigo-500/40 bg-indigo-500/10 text-white"
            : "border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:text-white",
          compact ? "px-2 py-1.5" : "px-3 py-1.5"
        )}
      >
        <span className="text-base leading-none">{current.flag}</span>
        {!compact && (
          <span className="text-xs font-semibold tracking-wide">{current.short}</span>
        )}
        {/* Chevron */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="opacity-50"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 min-w-[148px] rounded-xl border border-white/[0.1] bg-[#0d0d14]/95 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden z-[100]"
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.locale === locale;
              return (
                <button
                  key={lang.locale}
                  onClick={() => handleSelect(lang.locale)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-indigo-500/10 text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="font-medium flex-1 text-left">{lang.label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
