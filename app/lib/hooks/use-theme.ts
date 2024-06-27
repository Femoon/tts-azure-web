import { useState, useEffect, useCallback } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'

type ThemeType = 'light' | 'dark'

let isInitialized = false

function useTheme(): [ThemeType, (newTheme: ThemeType) => void] {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme') as ThemeType | null
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      return storedTheme || (mediaQuery.matches ? 'dark' : 'light')
    }
    return 'light'
  })

  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', newTheme)
      const root = document.documentElement
      const isDark = newTheme === 'dark'
      root.classList.remove(isDark ? 'light' : 'dark')
      root.classList.add(isDark ? 'dark' : 'light')
      updateOverlayScrollbarTheme(newTheme)
    }
  }, [])

  const updateOverlayScrollbarTheme = (newTheme: ThemeType) => {
    const osInstance = OverlayScrollbars(document.body)
    const scrollbarTheme = newTheme === 'dark' ? 'os-theme-light' : 'os-theme-dark'
    osInstance?.options({ scrollbars: { theme: scrollbarTheme } })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isInitialized) return
    isInitialized = true

    const storedTheme = window.localStorage.getItem('theme') as ThemeType | null
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const initialTheme = storedTheme || (mediaQuery.matches ? 'dark' : 'light')
    setTheme(initialTheme)

    const handleChange = () => {
      setThemeState(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme])

  return [theme, setTheme]
}

export default useTheme
