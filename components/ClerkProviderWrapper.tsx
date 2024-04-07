'use client';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark, neobrutalism } from '@clerk/themes';
import { frFR, esES, enUS } from "@clerk/localizations";
import { esCA } from "@/utils/cat_dict";

interface ClerkProviderWrapperProps {
    children: React.ReactNode;
    lang: string;
}


const ClerkProviderWrapper: React.FC<ClerkProviderWrapperProps> = ({ children, lang }) => {
    const { theme } = useTheme();

    const langMap = {
        'es': esES,
        'en': enUS,
        'fr': frFR,
        'ca': esES,
    };

    const locale = langMap[lang as keyof typeof langMap];

    let clerkTheme = dark; // Default to dark
    if (theme === 'light') {
        clerkTheme = neobrutalism; // Assuming neobrutalism is the light theme
    } else if (theme === 'dark') {
        clerkTheme = dark;
    }

    return (
        <ClerkProvider localization={locale} appearance={{ baseTheme: clerkTheme, variables: { colorPrimary: '#F97315' } }} >
            {children}
        </ClerkProvider>
    );
}

export default ClerkProviderWrapper;

