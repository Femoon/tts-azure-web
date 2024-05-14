import { NextApiRequest, NextApiResponse } from 'next'

let cachedToken: string | null = null
let tokenExpiration: Date | null = null

const azureTokenEndpoint = `https://${process.env.NEXT_PUBLIC_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`

async function fetchToken() {
  const res = await fetch(azureTokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY!,
    },
  })
  const data = await res.json()
  return data.token
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (!cachedToken || !tokenExpiration || tokenExpiration <= new Date()) {
    cachedToken = await fetchToken()
    tokenExpiration = new Date(new Date().getTime() + 3600 * 1000) // 假设 token 有效期为 1 小时
  }
  res.status(200).json({ token: cachedToken })
}
