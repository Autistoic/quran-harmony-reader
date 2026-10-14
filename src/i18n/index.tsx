import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

export type SupportedLanguage = "en" | "es";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

const STORAGE_KEY = "app_language";
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const dictionaries: Record<SupportedLanguage, Record<string, any>> = {
  en,
  es,
};

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && (saved === "en" || saved === "es")) {
      return saved;
    }
    const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
    if (browserLang.startsWith("es")) {
      return "es";
    }
  } catch (err) {
    console.warn("[i18n] Could not read language from localStorage:", err);
  }
  return DEFAULT_LANGUAGE;
}

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => initialLanguage ?? getInitialLanguage());

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (err) {
      console.warn("[i18n] Could not save language to localStorage:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // 1. Try active language
      let value = getNestedValue(dictionaries[language], key);

      // 2. Fallback to English if missing in active language
      if (value === undefined && language !== DEFAULT_LANGUAGE) {
        value = getNestedValue(dictionaries[DEFAULT_LANGUAGE], key);
      }

      // 3. If still missing, return the raw key string as safe fallback
      if (value === undefined) {
        return key;
      }

      // 4. Interpolate params e.g. {count} or {{count}}
      if (params) {
        return Object.entries(params).reduce((acc, [paramKey, paramVal]) => {
          return acc
            .replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"), String(paramVal))
            .replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
        }, value);
      }

      return value;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      changeLanguage: setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      changeLanguage: () => {},
      t: (key: string) => getNestedValue(dictionaries.en, key) ?? key,
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
