import { useEffect } from 'react'

import { useThemeStore, type ThemeType } from '@/app/lib/stores'

function useTheme(): [ThemeType, (newTheme: ThemeType) => void] {
  const { theme, setTheme, initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return [theme, setTheme]
}

export default useTheme
