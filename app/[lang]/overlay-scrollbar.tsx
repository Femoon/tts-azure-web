'use client'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import useTheme from '../lib/useTheme'

export function OverlayScrollbar({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme()
  const scrollbarTheme = theme === 'light' ? 'os-theme-dark' : 'os-theme-light'

  return (
    <OverlayScrollbarsComponent className="wrapper" element="body" options={{ scrollbars: { theme: scrollbarTheme } }}>
      {children}
    </OverlayScrollbarsComponent>
  )
}
