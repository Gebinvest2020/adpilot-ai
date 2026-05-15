"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Orb 1 - Purple/Indigo */}
      <motion.div
        animate={{ y: [-30, 30, -30], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          top: "10%",
          left: "15%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 2 - Cyan/Blue */}
      <motion.div
        animate={{ y: [20, -40, 20], x: [10, -15, 10] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          top: "40%",
          right: "10%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />

      {/* Orb 3 - Violet */}
      <motion.div
        animate={{ y: [-15, 25, -15], x: [-20, 5, -20] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          bottom: "5%",
          left: "30%",
          width: "600px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
