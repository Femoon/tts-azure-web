import { fetchList } from '../api/fetch-list'
import { ListItem } from '../lib/types'
import Content from './ui/content'
import Nav from './ui/nav'
import { getLocale } from '@/get-locale'
import type { Locale } from '@/i18n-config'

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await getLocale(lang)
  let list: ListItem[] = []

  try {
    list = await fetchList()
  } catch (err) {
    console.error('Failed to fetch list:', err)
  }

  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav t={t} />
      <Content t={t} list={list} />
    </main>
  )
}
