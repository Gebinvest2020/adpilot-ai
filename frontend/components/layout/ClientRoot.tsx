"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { I18nProvider, useLocale } from "@/lib/i18n";

/** Inner wrapper — must be inside I18nProvider to read locale */
function LocaleTransition({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locale}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function ClientRoot({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LocaleTransition>{children}</LocaleTransition>
    </I18nProvider>
  );
}
