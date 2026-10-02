import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Language } from "../types";
import en from "../locales/en.json";
import ml from "../locales/ml.json";

type Dictionary = typeof en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Dictionary;
  pick: (mlText?: string, enText?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "rk_language";
const dictionaries: Record<Language, Dictionary> = { en, ml };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      toggleLanguage: () => setLanguageState((prev) => (prev === "en" ? "ml" : "en")),
      t: dictionaries[language],
      pick: (mlText?: string, enText?: string) =>
        language === "ml" ? mlText || enText || "" : enText || mlText || "",
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
