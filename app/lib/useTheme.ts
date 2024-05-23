import { useState, useEffect } from 'react'

type ThemeType = 'light' | 'dark'

function useTheme(): [ThemeType, (newTheme: ThemeType) => void] {
  const [theme, setThemeState] = useState<ThemeType>('light')

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    window.localStorage.setItem('theme', newTheme)
    const root = document.documentElement
    const isDark = newTheme === 'dark'
    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(isDark ? 'dark' : 'light')
  }

  useEffect(() => {
    // client only
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (window.localStorage.getItem('theme')) {
      const storedTheme = window.localStorage.getItem('theme') as ThemeType | null
      setTheme(storedTheme || 'light')
    } else {
      setTheme(mediaQuery.matches ? 'dark' : 'light') // init theme
    }

    // listen browser theme change
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return [theme, setTheme]
}

export default useTheme
