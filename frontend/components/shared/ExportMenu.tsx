"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Table, FileJson, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExportOption {
  label: string;
  format: string;
  icon: React.ElementType;
  onClick: () => void;
}

interface ExportMenuProps {
  options: ExportOption[];
  label?: string;
  disabled?: boolean;
  variant?: "default" | "ghost";
}

export default function ExportMenu({
  options,
  label = "Export",
  disabled = false,
  variant = "default",
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={!disabled ? { scale: 1.04 } : {}}
        whileTap={!disabled ? { scale: 0.96 } : {}}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
          variant === "default"
            ? "border border-white/[0.1] text-white/45 hover:text-white hover:border-white/20"
            : "text-white/40 hover:text-white hover:bg-white/[0.05]",
          disabled && "opacity-30 cursor-not-allowed"
        )}
      >
        <Download className="w-3.5 h-3.5" />
        {label}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/[0.1] bg-[#0d0d14] shadow-2xl shadow-black/70 z-50 overflow-hidden"
          >
            {options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.format}
                  onClick={() => { opt.onClick(); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors text-left",
                    i > 0 && "border-t border-white/[0.04]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-white/35 flex-shrink-0" />
                  <span>{opt.label}</span>
                  <span className="ml-auto text-[9px] text-white/20 font-mono uppercase">{opt.format}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
