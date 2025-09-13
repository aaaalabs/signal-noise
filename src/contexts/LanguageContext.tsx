import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentLang, setLanguage, getTranslations } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: 'de' | 'en';
  toggleLanguage: () => void;
  t: any; // Dynamic translations object
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'de' | 'en'>(currentLang);

  const toggleLanguage = () => {
    const newLang = language === 'de' ? 'en' : 'de';
    setLanguage(newLang); // Update the translations module
    setLanguageState(newLang); // Update React state to trigger re-render
  };

  // Dynamic translations that update when language changes
  const translations = getTranslations();

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: language,
        toggleLanguage,
        t: translations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook for just getting translations (most common use case)
export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};