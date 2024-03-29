'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Locale } from '@/i18n-config';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const defaultLocaleContext: LocaleContextType = {
    locale: 'en',
    setLocale: () => null,
};

const LocaleContext = createContext<LocaleContextType>(defaultLocaleContext);

export function LocaleProvider({ children, initialLocale = 'en' }: { children: ReactNode, initialLocale: Locale }) {
    const [locale, setLocale] = useState<Locale>(initialLocale);

    useEffect(() => {
        setLocale(initialLocale);
    }, [initialLocale]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}
