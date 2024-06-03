import { headers } from 'next/headers'
import { ListItem } from '../lib/types'
import Content from './ui/content'
import Nav from './ui/nav'
import { getDictionary } from '@/get-dictionary'
import type { Locale } from '@/i18n-config'

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await getDictionary(lang)
  let list: ListItem[] = []
  const originHost = headers().get('x-forwarded-host')
  const originProto = headers().get('x-forwarded-proto')
  const host = originProto + '://' + originHost
  try {
    const res = await fetch(`${host}/api/list`)
    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      list = await res.json()
    } else {
      const text = await res.text()
      throw new Error(`Unexpected content type: ${contentType}. Response: ${text}`)
    }
  } catch (err) {
    console.error('Failed to fetch list:', err)
  }
  return (
    <main className="flex w-full min-h-screen flex-col">
      <Nav />
      <Content t={t} list={list} />
    </main>
  )
}
