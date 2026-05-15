"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import { useT, interp } from "@/lib/i18n";

export default function TestimonialsSection() {
  const t = useT();

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/8 mb-6">
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">
              {t.testimonials.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {t.testimonials.headline}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {t.testimonials.headlineGradient}
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">{t.testimonials.subtitle}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t_, index) => (
            <motion.div
              key={t_.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t_.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6 line-clamp-4">
                &ldquo;{t_.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t_.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-xs font-bold text-white">{t_.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t_.name}</p>
                  <p className="text-xs text-white/40">
                    {t_.role}, {t_.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                "from-indigo-500 to-violet-600",
                "from-cyan-500 to-blue-600",
                "from-violet-500 to-purple-600",
                "from-emerald-500 to-cyan-600",
              ].map((g, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-[#050508]`}
                />
              ))}
            </div>
            <span className="text-sm text-white/50 ml-1">
              {interp(t.testimonials.social.join, { n: "10,000" })}
            </span>
          </div>
          <div className="h-px sm:h-8 sm:w-px w-16 bg-white/[0.08]" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-sm text-white/50 ml-1">
              {interp(t.testimonials.social.rating, { score: "4.9", count: "2,400" })}
            </span>
          </div>
          <div className="h-px sm:h-8 sm:w-px w-16 bg-white/[0.08]" />
          <div className="text-sm text-white/50">
            <span className="text-white font-semibold">{t.testimonials.social.g2}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
