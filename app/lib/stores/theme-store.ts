import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OverlayScrollbars } from 'overlayscrollbars'

export type ThemeType = 'light' | 'dark'

interface ThemeState {
  theme: ThemeType
  isInitialized: boolean

  // Actions
  setTheme: (theme: ThemeType) => void
  initializeTheme: () => void
  toggleTheme: () => void
}

const updateOverlayScrollbarTheme = (theme: ThemeType) => {
  if (typeof window === 'undefined') return

  const osInstance = OverlayScrollbars(document.body)
  const scrollbarTheme = theme === 'dark' ? 'os-theme-light' : 'os-theme-dark'
  osInstance?.options({ scrollbars: { theme: scrollbarTheme } })
}

const applyThemeToDOM = (theme: ThemeType) => {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const isDark = theme === 'dark'

  root.classList.remove(isDark ? 'light' : 'dark')
  root.classList.add(isDark ? 'dark' : 'light')

  updateOverlayScrollbarTheme(theme)
}

const getSystemTheme = (): ThemeType => {
  if (typeof window === 'undefined') return 'light'

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return mediaQuery.matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isInitialized: false,

      setTheme: theme => {
        set({ theme })
        applyThemeToDOM(theme)
      },

      initializeTheme: () => {
        if (get().isInitialized) return

        const storedTheme = get().theme // 从 persist 中获取
        const systemTheme = getSystemTheme()
        const finalTheme = storedTheme || systemTheme

        get().setTheme(finalTheme)
        set({ isInitialized: true })

        // 监听系统主题变化
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = () => {
            // 只有在没有手动设置过主题时才跟随系统
            const currentState = get()
            if (!localStorage.getItem('theme-storage')) {
              currentState.setTheme(mediaQuery.matches ? 'dark' : 'light')
            }
          }

          mediaQuery.addEventListener('change', handleChange)

          // 清理函数在组件卸载时调用
          return () => mediaQuery.removeEventListener('change', handleChange)
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage',
      partialize: state => ({ theme: state.theme }),
    },
  ),
)
