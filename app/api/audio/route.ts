import { Buffer } from 'buffer'
import { NextRequest, NextResponse } from 'next/server'
import { AZURE_COGNITIVE_ENDPOINT } from '@/app/lib/constants'

async function fetchAudio(token: string, xml: string): Promise<any> {
  const res = await fetch(AZURE_COGNITIVE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-MICROSOFT-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
    },
    body: xml,
  })

  return res
}

export async function POST(req: NextRequest) {
  try {
    // fetch token
    const tokenResponse = await fetch(`${req.nextUrl.origin}/api/token`, { method: 'POST' })

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: tokenResponse.statusText }, { status: tokenResponse.status })
    }
    const { token } = await tokenResponse.json()
    const data = await req.text()

    // use token to request
    const audioResponse = await fetchAudio(token, data)

    if (!audioResponse.ok) {
      return NextResponse.json({ error: audioResponse.statusText }, { status: audioResponse.status })
    }

    const arrayBuffer = await audioResponse.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')
    return NextResponse.json({ base64Audio })
  } catch (error) {
    console.error('Error in audio POST handler:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
