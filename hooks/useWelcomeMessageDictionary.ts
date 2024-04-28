import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';
import { Dictionary } from '@/types/dictionary';

export const useWelcomeMessageDictionary = () => {
    const { locale } = useLocale();
    const [welcomeMessageDict, setWelcomeMessageDict] = useState<Dictionary['welcomeMessage']>({
        welcomeUser: {
            welcome: '',
            message: '',
            welcome_no_user: '',
        },
        overview: {
            title: '',
            description: '',
        },
        features: {
            title: '',
            items: [],
        },
        fine_tuned: {
            title: '',
            description: '',
            items: [], 
        },
        technology: {
            title: '',
            items: [], 
        },
        examples: {
            title: '',
            description: '',
            items: [], 
        },
    });
  
    useEffect(() => {
      const fetchDictionary = async () => {
        try {
          const dictionary = await getDictionary(locale);
          setWelcomeMessageDict(dictionary.welcomeMessage);
        } catch (error) {
          console.error("Failed to load welcome message dictionary:", error);
        }
      };
  
      fetchDictionary();
    }, [locale]);
  
    return welcomeMessageDict;
  };