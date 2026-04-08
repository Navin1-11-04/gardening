"use client";

import { useState, useEffect, useCallback } from "react";
import { Locale, defaultLocale } from "@/lib/i18n/locales";

type Messages = Record<string, any>;

const messagesCache: Record<string, Messages> = {};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messagesCache[locale]) {
    return messagesCache[locale];
  }

  try {
    const messages = await import(`@/messages/${locale}.json`);
    messagesCache[locale] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && ["en", "ta"].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  // Load translations
  useEffect(() => {
    setIsLoading(true);
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ta" ? "ltr" : "ltr";
      setIsLoading(false);
    });
  }, [locale]);

  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split(".");
      let value: any = messages;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      return (value as string) || defaultValue || key;
    },
    [messages],
  );

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return {
    t,
    locale,
    changeLocale,
    isLoading,
  };
}
