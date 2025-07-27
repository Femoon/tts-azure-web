'use client'
import { useEffect } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'

import useTheme from '../lib/hooks/use-theme'
import 'overlayscrollbars/overlayscrollbars.css'

export function OverlayScrollbar() {
  const [theme] = useTheme()
  const scrollbarTheme = theme === 'light' ? 'os-theme-dark' : 'os-theme-light'
  useEffect(() => {
    if (typeof window === 'undefined') return

    const osInstance = OverlayScrollbars(
      {
        target: document.body,
        cancel: {
          nativeScrollbarsOverlaid: true,
          body: null,
        },
      },
      {
        scrollbars: {
          theme: scrollbarTheme,
        },
      },
    )

    return () => {
      if (osInstance) {
        osInstance.destroy()
      }
    }
  }, [scrollbarTheme])
  return null
}
