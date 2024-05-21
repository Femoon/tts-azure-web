import { Providers } from './providers'
import '@/styles/globals.css'
import { i18n, type Locale } from '@/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  return (
    <html lang={params.lang}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
