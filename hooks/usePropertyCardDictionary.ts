import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';
import { Dictionary } from '@/types/dictionary';

export const usePropertyCardDictionary = () => {
    const { locale } = useLocale();
    const [propertyCardDict, setPropertyCardDict] = useState<Dictionary['property_card']>({
        month: '',
        room: '',
        rooms: '',
        bathroom: '',
        bathrooms: '',
        total_results: '',
        last_question: '',
        no_results: '',
    });
  
    useEffect(() => {
      const fetchDictionary = async () => {
        try {
          const dictionary = await getDictionary(locale);
          setPropertyCardDict(dictionary.property_card);
        } catch (error) {
          console.error("Failed to load property card dictionary:", error);
        }
      };
  
      fetchDictionary();
    }, [locale]);
  
    return propertyCardDict;
  };