import { createContext } from "react";
import type { TranslationKey } from "./translations";

export type Language = "uz" | "ru";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
