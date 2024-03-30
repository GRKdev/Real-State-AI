// Assuming you have the Dictionary interface defined somewhere
import { Dictionary } from '@/types/dictionary'; // Adjust path as necessary

// Typing the dictionaries object to ensure each key returns a Promise<Dictionary>
const dictionaries: Record<string, () => Promise<Dictionary>> = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    ca: () => import('./dictionaries/ca.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
};

// Explicitly typing getDictionary to return a Promise<Dictionary>
export const getDictionary = async (locale: string): Promise<Dictionary> => {
    if (!dictionaries[locale]) {
        throw new Error(`Dictionary for locale "${locale}" not found.`);
    }
    return dictionaries[locale]();
};
