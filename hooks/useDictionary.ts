import { useState, useEffect } from 'react';
import { getDictionary } from '@/dictionaries';
import { useLocale } from '@/contexts/localeContext';
import { Dictionary } from '@/types/dictionary';

export const useDictionary = <T extends keyof Dictionary>(key: T) => {
    const { locale } = useLocale();
    const [dict, setDict] = useState<Dictionary[T]>({} as Dictionary[T]);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                const dictionary = await getDictionary(locale);
                setDict(dictionary[key]);
            } catch (error) {
                console.error(`Failed to load dictionary for key: ${key}`, error);
            }
        };

        fetchDictionary();
    }, [locale, key]);

    return dict;
};
