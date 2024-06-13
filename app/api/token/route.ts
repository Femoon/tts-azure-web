import { NextResponse } from 'next/server'
import { AZURE_TOKEN_ENDPOINT } from '@/app/lib/constants'

let cachedToken: string | null = null
let tokenExpiration: Date | null = null

async function fetchToken() {
  try {
    const res = await fetch(AZURE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
      },
    })
    if (!res.ok) {
      throw new Error(`Error fetching token: ${res.statusText}`)
    }
    const data = await res.text()
    return data
  } catch (error) {
    console.error('Failed to fetch token:', error)
    throw error
  }
}

export async function POST() {
  try {
    if (!cachedToken || !tokenExpiration || tokenExpiration <= new Date()) {
      cachedToken = await fetchToken()
      tokenExpiration = new Date(new Date().getTime() + 20 * 1000) // 20s
    }
    return NextResponse.json({ token: cachedToken })
  } catch (error) {
    return NextResponse.json({ error: 'Failed fetch token' }, { status: 500 })
  }
}
