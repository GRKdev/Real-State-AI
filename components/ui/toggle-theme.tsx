'use client'

import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from './button';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const renderIcon = () => {
        if (!mounted) return null;

        return theme === "dark" ? <Button variant="ghost"><Sun /></Button> : <Button variant="ghost"><Moon /></Button>;
    };

    return (
        <button onClick={toggleTheme} aria-label="Toggle theme">
            {renderIcon()}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
