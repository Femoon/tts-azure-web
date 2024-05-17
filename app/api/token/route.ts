import { NextResponse } from 'next/server'
import { azureTokenEndpoint } from '@/app/lib/constants'

let cachedToken: string | null = null
let tokenExpiration: Date | null = null

async function fetchToken() {
  try {
    const res = await fetch(azureTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY!,
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
      tokenExpiration = new Date(new Date().getTime() + 20 * 1000) // 假设 token 有效期为 20s
    }
    return NextResponse.json({ token: cachedToken })
  } catch (error) {
    return NextResponse.json({ error: 'Failed fetch token' }, { status: 500 })
  }
}
