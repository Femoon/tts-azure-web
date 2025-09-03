import { getLocale } from '@/app/lib/i18n/get-locale'
import type { Locale } from '@/app/lib/i18n/i18n-config'
import speechList from '@/assets/speechList.json'

import { fetchList } from '../api/list/fetch-list'
import { ProcessedVoiceData } from '../lib/types'

import Content from './ui/content'
import Nav from './ui/nav'

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = await getLocale(lang)
  let processedData: ProcessedVoiceData = {
    languages: [],
    gendersByLang: {},
    voicesByLangGender: {},
    stylesAndRoles: {},
  }

  const isDemoMode = process.env.DEMO_MODE === 'true'

  try {
    if (isDemoMode) {
      processedData = speechList
    } else {
      processedData = await fetchList()
    }
  } catch (err) {
    console.error('Failed to fetch voice data:', err)
  }

  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav t={t} />
      <Content t={t} processedData={processedData} isDemoMode={isDemoMode} />
    </main>
  )
}
