import { createContext, useContext, useState } from 'react';
import { translations } from '../lib/translations';

const LangContext = createContext(null);
const STORAGE_KEY = 'airmoon-lang';

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'id');

  function changeLang(next) {
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function t(key) {
    return translations[lang]?.[key] ?? translations.id[key] ?? key;
  }

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
