'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import dictionaries from './dictionaries.json';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, args?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko');

  // 로컬 스토리지에서 언어 설정 불러오기
  useEffect(() => {
    const savedLang = localStorage.getItem('artlink_lang') as Language;
    if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('artlink_lang', lang);
  };

  // 경로를 기반으로 번역 텍스트를 가져오는 함수 (예: 'common.explore')
  const t = (path: string, args?: Record<string, string | number>) => {
    const keys = path.split('.');
    let current: any = (dictionaries as any)[language];
    
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else {
        return path; // 번역을 찾지 못한 경우 경로 반환
      }
    }
    
    if (typeof current === 'string' && args) {
      Object.entries(args).forEach(([key, value]) => {
        current = current.replace(`{${key}}`, String(value));
      });
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
