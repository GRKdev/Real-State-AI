// hooks/useExtraOptionsDictionary.ts
import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';
import { Dictionary } from '@/types/dictionary';

export const useExtraOptionsDictionary = () => {
  const { locale } = useLocale();
  const [extraOptionsDict, setExtraOptionsDict] = useState<Dictionary['extra_options']>({
      terrace: '',
    title: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    balcony: '',
    garden: '',
    elevator: '',
    heating: '',
    electrod: '',
    furnished: '',
  });

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dictionary = await getDictionary(locale);
        setExtraOptionsDict(dictionary.extra_options);
      } catch (error) {
        console.error("Failed to load extra_options dictionary:", error);
      }
    };

    fetchDictionary();
  }, [locale]);

  return extraOptionsDict;
};
