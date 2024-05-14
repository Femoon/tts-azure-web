import { NextApiRequest, NextApiResponse } from 'next'

const url = `https://${process.env.NEXT_PUBLIC_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

async function fetchAudio(token: string, input: string, voiceName: string, selectedLang: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-MICROSOFT-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
    },
    body: `<speak version='1.0'  xml:lang='${selectedLang}' xml:gender='Female'><voice name='${voiceName}'>${input}</voice></speak>`,
  })
  return response.json()
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log('post audio')
  console.log(req.headers.origin)
  // 获取 token
  const tokenResponse = await fetch(req.headers.origin + '/api/token')
  const { token } = await tokenResponse.json()
  const { input, voiceName, selectedLang } = req.body
  // 使用 token 发送请求
  const data = await fetchAudio(token, input, voiceName, selectedLang)
  res.status(200).json(data)
}
