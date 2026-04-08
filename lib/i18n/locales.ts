export const locales = ["en", "ta"] as const;
export const defaultLocale: (typeof locales)[number] = "en";

export const localeNames: Record<(typeof locales)[number], string> = {
  en: "English",
  ta: "தமிழ்",
};

export type Locale = (typeof locales)[number];
