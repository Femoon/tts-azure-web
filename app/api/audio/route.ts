import { Buffer } from 'buffer'

import { NextRequest, NextResponse } from 'next/server'

import { AZURE_COGNITIVE_ENDPOINT, MAX_INPUT_LENGTH } from '@/app/lib/constants'
import { generateSSML } from '@/app/lib/tools'

import { fetchToken } from '../token/fetch-token'

async function fetchAudio(token: string, SSML: string): Promise<Response> {
  const res = await fetch(AZURE_COGNITIVE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-MICROSOFT-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
    },
    body: SSML,
    cache: 'no-store',
  })

  return res
}

export const maxDuration = 20

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    if (payload.input.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: 'Request body too large. Maximum allowed size is ' + MAX_INPUT_LENGTH + ' characters.' },
        { status: 413 },
      )
    }

    const token = await fetchToken()
    const audioResponse = await fetchAudio(token, generateSSML({ input: payload.input, config: payload.config }))

    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: 'Error fetching audio. Error code: ' + audioResponse.status },
        { status: audioResponse.status },
      )
    }

    const arrayBuffer = await audioResponse.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')
    return NextResponse.json({ base64Audio })
  } catch (error) {
    console.error('Error in audio POST handler:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
