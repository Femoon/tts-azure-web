import { AZURE_LIST_ENDPOINT } from '@/app/lib/constants'

import 'server-only'

export async function fetchList() {
  const res = await fetch(AZURE_LIST_ENDPOINT, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
    },
    cache: 'force-cache',
    next: {
      revalidate: 60 * 60 * 24, // cache 24 hours
    },
  })

  return res
}
