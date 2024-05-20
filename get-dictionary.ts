import 'server-only'
import type { Locale } from './i18n-config'
const dictionaries: any = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  'zh-cn': () => import('@/dictionaries/zh.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en()
