import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';
import { Dictionary } from '@/types/dictionary';

export const useFiltersDictionary = () => {
  const { locale } = useLocale();
  const [filtersDict, setFiltersDict] = useState<Dictionary['filters']>({
    sign_in: '',
    title_filter: '',
    no_filters: '',
    price: '',
    bedroom: '',
    bathroom: '',
    square: '',
    searchbar: '',
    microphone: '',
    choose_model: '',
    model_finetune: '',
    model_system: '',
});

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dictionary = await getDictionary(locale);
        setFiltersDict(dictionary.filters);
      } catch (error) {
        console.error("Failed to load filters dictionary:", error);
      }
    };

    fetchDictionary();
  }, [locale]);

  return filtersDict;
};