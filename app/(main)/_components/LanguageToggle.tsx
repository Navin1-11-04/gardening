"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { locale, changeLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => changeLocale("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          locale === "en"
            ? "bg-white text-[#3d6b35] shadow"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => changeLocale("ta")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          locale === "ta"
            ? "bg-white text-[#3d6b35] shadow"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="Tamil"
      >
        TA
      </button>
    </div>
  );
}
