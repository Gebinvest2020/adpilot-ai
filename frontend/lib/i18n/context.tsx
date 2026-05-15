"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "./types";
import { en } from "./en";
import { ru } from "./ru";

const LOCALES: Record<Locale, Translations> = { en, ru };
const STORAGE_KEY = "adpilot_locale";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && LOCALES[stored]) {
      setLocaleState(stored);
    }
  }, []);

  // Update <html lang> when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: LOCALES[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Main hook — returns full translation object */
export function useT(): Translations {
  return useContext(I18nContext).t;
}

/** Returns locale + setter separately */
export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const { locale, setLocale } = useContext(I18nContext);
  return { locale, setLocale };
}

/** Interpolate {key} placeholders: interp("Hello {name}", { name: "Alex" }) */
export function interp(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    template
  );
}
