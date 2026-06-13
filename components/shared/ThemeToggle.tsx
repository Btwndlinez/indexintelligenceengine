'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
        setTheme(current);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('mie-theme', next);
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            id="theme-toggle"
        >
            <div className="theme-toggle-knob">
                {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
            </div>
        </button>
    );
}
