import Content from './ui/content'
import Nav from './ui/nav'
import { getDictionary } from '@/get-dictionary'
import type { Locale } from '@/i18n-config'

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await getDictionary(lang)
  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav />
      <Content t={t} />
    </main>
  )
}
