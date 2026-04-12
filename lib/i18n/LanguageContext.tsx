"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Locale, defaultLocale } from "./locales";

// ─── Types ────────────────────────────────────────────────────────────────────

type Messages = Record<string, any>;

interface LanguageContextValue {
  locale: Locale;
  t: (key: string, defaultValue?: string) => string;
  changeLocale: (locale: Locale) => void;
  isLoading: boolean;
}

// ─── Message cache (module-level, shared) ─────────────────────────────────────

const messagesCache: Record<string, Messages> = {};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messagesCache[locale]) return messagesCache[locale];
  try {
    const mod = await import(`@/messages/${locale}.json`);
    messagesCache[locale] = mod.default;
    return mod.default;
  } catch {
    return {};
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale]     = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  // Read saved locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale") as Locale | null;
      if (saved && (["en", "ta"] as string[]).includes(saved)) {
        setLocale(saved as Locale);
      }
    } catch {}
  }, []);

  // Load translations whenever locale changes
  useEffect(() => {
    setIsLoading(true);
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      try {
        localStorage.setItem("locale", locale);
        document.documentElement.lang = locale;
      } catch {}
      setIsLoading(false);
    });
  }, [locale]);

  // Translate function — dot-notation key lookup
  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const parts = key.split(".");
      let value: any = messages;
      for (const part of parts) {
        value = value?.[part];
        if (value === undefined) break;
      }
      return (typeof value === "string" ? value : null) ?? defaultValue ?? key;
    },
    [messages]
  );

  const changeLocale = useCallback((next: Locale) => {
    setLocale(next);
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, t, changeLocale, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}