"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, Copy, X } from "lucide-react";
import { useToast, type ToastType } from "@/lib/toast";
import { cn } from "@/lib/utils";

// ─── Config per type ─────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: React.ElementType;
    glow: string;
    border: string;
    bg: string;
    iconColor: string;
    bar: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    glow:      "shadow-emerald-500/20",
    border:    "border-emerald-500/25",
    bg:        "bg-[#0a1812]",
    iconColor: "text-emerald-400",
    bar:       "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    glow:      "shadow-red-500/20",
    border:    "border-red-500/25",
    bg:        "bg-[#150a0a]",
    iconColor: "text-red-400",
    bar:       "bg-red-500",
  },
  info: {
    icon: Info,
    glow:      "shadow-indigo-500/15",
    border:    "border-indigo-500/20",
    bg:        "bg-[#0a0b18]",
    iconColor: "text-indigo-400",
    bar:       "bg-indigo-500",
  },
  warning: {
    icon: AlertTriangle,
    glow:      "shadow-amber-500/15",
    border:    "border-amber-500/20",
    bg:        "bg-[#141008]",
    iconColor: "text-amber-400",
    bar:       "bg-amber-500",
  },
  copy: {
    icon: Copy,
    glow:      "shadow-violet-500/15",
    border:    "border-violet-500/20",
    bg:        "bg-[#0c0a18]",
    iconColor: "text-violet-400",
    bar:       "bg-violet-500",
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

function ToastCard({ id, type, message }: { id: string; type: ToastType; message: string }) {
  const { dismiss } = useToast();
  const cfg = TOAST_CONFIG[type];
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative flex items-center gap-3 pl-4 pr-3 py-3",
        "rounded-xl border backdrop-blur-xl shadow-xl",
        "min-w-[260px] max-w-[360px] overflow-hidden",
        cfg.bg, cfg.border, cfg.glow
      )}
    >
      {/* Accent bar */}
      <div className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", cfg.bar)} />

      <Icon className={cn("w-4 h-4 flex-shrink-0", cfg.iconColor)} />
      <p className="flex-1 text-sm font-medium text-white/80 leading-snug">{message}</p>
      <button
        onClick={() => dismiss(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/55 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Renderer (portal) ───────────────────────────────────────────────────────

export default function ToastRenderer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
