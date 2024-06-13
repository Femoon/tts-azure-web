import { Buffer } from 'buffer'
import { NextRequest, NextResponse } from 'next/server'
import { AZURE_COGNITIVE_ENDPOINT } from '@/app/lib/constants'

async function fetchAudio(token: string, data: any): Promise<string> {
  try {
    const response = await fetch(AZURE_COGNITIVE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/ssml+xml',
        'X-MICROSOFT-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
      },
      body: getXML(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64String = Buffer.from(arrayBuffer).toString('base64')
    return base64String
  } catch (error) {
    console.error('Error fetching audio:', error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    // fetch token
    const tokenResponse = await fetch(`${req.nextUrl.origin}/api/token`, { method: 'POST' })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`)
    }
    const { token } = await tokenResponse.json()
    const data = await req.json()

    // use token to request
    const base64Audio = await fetchAudio(token, data)
    return NextResponse.json({ base64Audio })
  } catch (error) {
    console.error('Error in POST handler:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function getXML(data: any) {
  const { input, config } = data
  const { lang, voiceName, style, styleDegree, role, volume, rate, pitch } = config
  const styleProperty = style ? ` style="${style}"` : ''
  const styleDegreeProperty = styleDegree ? ` styleDegree="${styleDegree}"` : ''
  const roleProperty = role ? ` role="${role}"` : ''
  const volumeProperty = ` volume="${volume}"`
  const rateProperty = ` rate="${rate}%"`
  const pitchProperty = ` pitch="${pitch}%"`
  const xml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">
    <voice name="${voiceName}">
        <mstts:express-as${roleProperty}${styleProperty}${styleDegreeProperty}>
            <prosody${volumeProperty}${rateProperty}${pitchProperty}>
                ${input}
            </prosody>
        </mstts:express-as>
    </voice>
</speak>`
  console.log(xml)
  return xml
}
