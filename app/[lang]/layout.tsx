import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import { OverlayScrollbar } from './overlay-scrollbar'
import { Providers } from './providers'
import '@/styles/globals.css'
import { i18n, type Locale } from '@/app/lib/i18n/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Azure Text To Speech(TTS)',
  description: 'Free Azure Text To Speech(TTS)',
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  const lang = params.lang === 'cn' ? 'zh-CN' : 'en'
  return (
    <html lang={lang} data-overlayscrollbars-initialize>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body data-overlayscrollbars-initialize>
        <Analytics />
        <SpeedInsights />
        <OverlayScrollbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
