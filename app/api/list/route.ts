import { NextResponse } from 'next/server'
import { azureListEndpoint } from '@/app/lib/constants'

async function fetchList() {
  const res = await fetch(azureListEndpoint, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY!,
    },
    next: {
      revalidate: 60 * 60 * 24, // cache 24 hours
    },
  })
  const data = await res.json()
  return data
}

export async function GET() {
  try {
    const res = await fetchList()
    return NextResponse.json(res)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetchConfig' }, { status: 500 })
  }
}
