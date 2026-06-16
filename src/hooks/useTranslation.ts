import { useState, useCallback, useEffect } from 'react';
import { translations, type Lang } from '../translations';

export function useTranslation() {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('cobra-lang') as Lang) || 'en';
    }
    return 'en';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('cobra-lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  }, [lang]);

  const isRTL = lang === 'fa';

  return { lang, setLang, t, isRTL };
}
