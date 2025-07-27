import 'server-only'
import type { Locale } from './i18n-config'
const locales: Record<Locale, () => Promise<any>> = {
  en: () => import('@/locales/en.json').then(module => module.default),
  cn: () => import('@/locales/cn.json').then(module => module.default),
}

export const getLocale = async (locale: Locale) => locales[locale]?.() ?? locales.en()
