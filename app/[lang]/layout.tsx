import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import { OverlayScrollbar } from './overlay-scrollbar'
import { Providers } from './providers'
import '@/styles/globals.css'
import { i18n, type Locale } from '@/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Text To Speech(TTS) Web',
  description: 'Free TTS Web',
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  return (
    <html lang={params.lang}>
      <Analytics />
      <SpeedInsights />
      <OverlayScrollbar>
        <Providers>{children}</Providers>
      </OverlayScrollbar>
    </html>
  )
}
