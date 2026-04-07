/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'

export type DaisyTheme = 'dim' | 'silk'

export type ThemeContextType = {
  theme: DaisyTheme
  setTheme: (theme: DaisyTheme) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'silk',
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DaisyTheme>(() => {
    const saved = localStorage.getItem('theme') as DaisyTheme | null
    return saved || 'silk'
  })

  // Sync data-theme and localStorage when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Update both state and DOM when toggled
  const setTheme = (newTheme: DaisyTheme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
