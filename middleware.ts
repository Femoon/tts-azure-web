import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'
import { i18n } from './app/lib/i18n/i18n-config'
import type { NextRequest } from 'next/server'

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}

function getCookie(name: string, cookies: string): string | undefined {
  const value = `; ${cookies}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const excludedPaths = [
    '/manifest.json',
    '/favicon.ico',
    '/site.webmanifest',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/mstile-150x150.png',
    '/safari-pinned-tab.svg',
    '/browserconfig.xml',
  ]
  if (excludedPaths.includes(pathname)) return

  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  const setSecurityHeaders = (response: NextResponse) => {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none';")
    return response
  }

  if (pathnameIsMissingLocale) {
    const cookies = request.headers.get('cookie') || ''
    const cookieLang = getCookie('user-language', cookies)
    const cookieLocale = cookieLang && (cookieLang.startsWith('zh') ? 'cn' : 'en')
    const locale = cookieLocale || getLocale(request)
    const redirectUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)

    const response = NextResponse.redirect(redirectUrl)
    setSecurityHeaders(response)

    return response
  }

  const response = NextResponse.next()
  setSecurityHeaders(response)

  return response
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
