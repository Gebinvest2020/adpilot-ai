"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "purple" | "blue" | "cyan" | "none";
  hover?: boolean;
}

export default function GlowCard({
  children,
  className,
  glowColor = "purple",
  hover = true,
}: GlowCardProps) {
  const glowClass = {
    purple: "hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
    blue: "hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
    cyan: "hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
    none: "",
  }[glowColor];

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        "backdrop-blur-xl bg-white/[0.03] border-white/[0.08]",
        glowClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
