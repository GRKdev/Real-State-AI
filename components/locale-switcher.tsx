"use client";

import { useLocale } from '@/contexts/localeContext';
import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Earth } from "lucide-react";
import { Button } from './ui/button';

const localeNames = {
    ca: "Català",
    es: "Castellano",
    fr: "Français",
    en: "English",
};
export default function LocaleSwitcher() {
    const { locale, setLocale } = useLocale();
    const router = useRouter();
    const pathName = usePathname();

    const redirectedPathName = (locale: Locale) => {
        if (!pathName) return '/';
        const segments = pathName.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const handleLocaleChange = (locale: Locale) => {
        setLocale(locale);
        router.push(redirectedPathName(locale));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Earth size={24} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {i18n.locales.map((locale) => (
                    <DropdownMenuItem key={locale} onClick={() => handleLocaleChange(locale)}>
                        {localeNames[locale]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
