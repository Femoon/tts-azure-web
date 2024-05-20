import { useState, useEffect } from 'react'

type ThemeType = 'light' | 'dark'

function useTheme(): ThemeType {
  const [theme, setTheme] = useState<ThemeType>('light')

  useEffect(() => {
    // 仅在客户端执行的代码
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light')
      setTheme(mediaQuery.matches ? 'dark' : 'light') // 初始化时设置主题
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return theme
}

export default useTheme
