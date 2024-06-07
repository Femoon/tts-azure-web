import { azureListEndpoint } from '@/app/lib/constants'

export async function fetchList() {
  const res = await fetch(azureListEndpoint, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
    },
    next: {
      revalidate: 60 * 60 * 24, // cache 24 hours
    },
  })
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json()
    return data
  } else {
    const text = await res.text()
    throw new Error(`Unexpected content type: ${contentType}. Response: ${text}`)
  }
}
