"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageToggle() {
  const { locale, changeLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-1 border border-white/20 backdrop-blur-sm">
      {(["en", "ta"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => changeLocale(loc)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            locale === loc
              ? "bg-white text-[#3d6b35] shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
          title={loc === "en" ? "English" : "தமிழ்"}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}