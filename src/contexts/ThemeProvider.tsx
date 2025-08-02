import { createContext, useEffect, useState, type ReactNode } from 'react';

//export type DaisyTheme = 'light' | 'dark' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate' | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween' | 'garden' | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy' | 'wireframe' | 'black' | 'luxury' | 'dracula' | 'cmyk' | 'autumn' | 'business' | 'acid' | 'lemonade' | 'night' | 'coffee' | 'winter' | 'dim' | 'nord' | 'sunset' | 'caramellatte' | 'abyss' | 'silk'

export type DaisyTheme = 'dim' | 'silk'

export type ThemeContextType = {
    theme: DaisyTheme;
    setTheme: (theme: DaisyTheme) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'silk',
    setTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<DaisyTheme>(() => {
        const saved = localStorage.getItem('theme') as DaisyTheme | null;
        return saved || 'silk';
    });

    // Sync data-theme and localStorage when theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Update both state and DOM when toggled
    const setTheme = (newTheme: DaisyTheme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
