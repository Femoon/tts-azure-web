import { Config, GenderItem, ListItem } from './types'

export function saveAs(blob: Blob, name: string) {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display: none')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
}

export function getGenders(data: ListItem[]): GenderItem[] {
  const allGenders = data.map(item => item.Gender)
  const genderList = [...new Set(allGenders)]
  const genders = genderList.map(item => ({
    label: item.toLowerCase(),
    value: item,
  }))

  return genders
}

export function base64AudioToBlobUrl(base64Audio: string) {
  const binaryString = atob(base64Audio)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: 'audio/mp3' })
  return URL.createObjectURL(blob)
}

interface VoiceName {
  label: string
  value: string
  hasStyle: boolean
  hasRole: boolean
}

export function sortWithMultilingual(voiceNames: VoiceName[]): VoiceName[] {
  return voiceNames.sort((a: VoiceName, b: VoiceName) => {
    const aContainsMultilingual = a.value.toLowerCase().includes('multilingual')
    const bContainsMultilingual = b.value.toLowerCase().includes('multilingual')

    if (aContainsMultilingual && !bContainsMultilingual) {
      return -1
    }
    if (!aContainsMultilingual && bContainsMultilingual) {
      return 1
    }
    return 0
  })
}

export function sortWithSimplifiedMandarin(voiceNames: VoiceName[]): VoiceName[] {
  return voiceNames.sort((a, b) => {
    if (a.value.includes('XiaoxiaoMultilingualNeural')) return -1
    if (b.value.includes('XiaoxiaoMultilingualNeural')) return 1
    return 0
  })
}

export function generateSSML(data: { input: string; config: Config }): string {
  const { input, config } = data
  const { lang, voiceName, style, styleDegree, role, volume, rate, pitch } = config
  const styleProperty = style ? ` style="${style}"` : ''
  const styleDegreeProperty = styleDegree ? ` styleDegree="${styleDegree}"` : ''
  const roleProperty = role ? ` role="${role}"` : ''
  const volumeProperty = ` volume="${volume}%"`
  const rateProperty = ` rate="${rate}%"`
  const pitchProperty = ` pitch="${pitch}%"`
  const SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">
    <voice name="${voiceName}">
        <mstts:express-as${roleProperty}${styleProperty}${styleDegreeProperty}>
            <prosody${volumeProperty}${rateProperty}${pitchProperty}>
                ${input}
            </prosody>
        </mstts:express-as>
    </voice>
</speak>`
  // console.log(SSML)
  return SSML
}
