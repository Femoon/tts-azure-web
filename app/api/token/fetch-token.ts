import { AZURE_TOKEN_ENDPOINT } from '@/app/lib/constants'

import 'server-only'

let cachedToken: string | null = null
let tokenExpiration: Date | null = null

export async function fetchToken(): Promise<string> {
  if (!cachedToken || !tokenExpiration || tokenExpiration <= new Date()) {
    const res = await fetch(AZURE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Error fetching token. Error code: ${res.status}`)
    }

    cachedToken = await res.text()
    tokenExpiration = new Date(new Date().getTime() + 20 * 1000) // 20s
  }

  return cachedToken
}
