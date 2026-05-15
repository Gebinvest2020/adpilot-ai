import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: "purple" | "blue" | "cyan-blue";
}

export default function GradientText({
  children,
  className,
  variant = "purple",
}: GradientTextProps) {
  const gradientClass = {
    purple: "bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400",
    blue: "bg-gradient-to-r from-cyan-400 to-blue-500",
    "cyan-blue": "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500",
  }[variant];

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        gradientClass,
        className
      )}
    >
      {children}
    </span>
  );
}
