import { NextResponse } from 'next/server'
import { AZURE_TOKEN_ENDPOINT } from '@/app/lib/constants'

let cachedToken: string | null = null
let tokenExpiration: Date | null = null

async function fetchToken() {
  const res = await fetch(AZURE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
    },
  })

  return res
}

export async function POST() {
  try {
    if (!cachedToken || !tokenExpiration || tokenExpiration <= new Date()) {
      const res = await fetchToken()
      if (!res.ok) {
        return NextResponse.json({ error: res.statusText }, { status: res.status })
      }
      cachedToken = await res.text()
      tokenExpiration = new Date(new Date().getTime() + 20 * 1000) // 20s
    }
    return NextResponse.json({ token: cachedToken })
  } catch (error) {
    console.error('Error in token POST handler:', error)
    return NextResponse.json({ error: 'Failed fetch token' }, { status: 500 })
  }
}
