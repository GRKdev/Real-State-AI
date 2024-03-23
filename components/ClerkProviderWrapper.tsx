// ClerkProviderWrapper.tsx
'use client';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark, neobrutalism } from '@clerk/themes';

const ClerkProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useTheme();

    // Logic to dynamically switch Clerk themes based on the current theme
    let clerkTheme = dark; // Default to dark
    if (theme === 'light') {
        clerkTheme = neobrutalism; // Assuming neobrutalism is the light theme
    } else if (theme === 'dark') {
        clerkTheme = dark;
    }
    console.log('Clerk Theme:', clerkTheme);


    return (
        <ClerkProvider appearance={{ baseTheme: clerkTheme, variables: { colorPrimary: '#F97315' } }}>
            {children}
        </ClerkProvider>
    );
};

export default ClerkProviderWrapper;
