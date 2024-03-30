// hooks/useNavbarDictionary.ts
import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';

export const useNavbarDictionary = () => {
  const { locale } = useLocale();
  const [navbarDict, setNavbarDict] = useState<{ searchbar: string }>({ searchbar: '' });

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dictionary = await getDictionary(locale);
        setNavbarDict(dictionary.navbar);
      } catch (error) {
        console.error("Failed to load navbar dictionary:", error);
      }
    };

    fetchDictionary();
  }, [locale]);

  return navbarDict;
};
