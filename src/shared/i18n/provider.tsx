import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { LanguageContext, type Language } from "./context";
import { translations, type TranslationKey } from "./translations";

const STORAGE_KEY = "orzu-language";

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "ru" || saved === "uz" ? saved : "uz";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey, values: Record<string, string | number> = {}) =>
        Object.entries(values).reduce(
          (text, [name, replacement]) =>
            text.replaceAll(`{${name}}`, String(replacement)),
          translations[language][key] as string,
        ),
      tr: (uzbek: string, russian: string) =>
        language === "ru" ? russian : uzbek,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
