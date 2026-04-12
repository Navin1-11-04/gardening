"use client";

// Re-export from the shared context so all components
// get the SAME locale instance (no more per-component isolation).
export { useLanguage as useTranslation } from "./LanguageContext";