import { Config, GenderItem, ListItem, VoiceName } from './types'

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
    value: item.toLowerCase(),
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

export function processVoiceName(voiceNames: VoiceName[], gender: string, lang: string) {
  sortWithMultilingual(voiceNames)
  if (lang === 'zh-CN') {
    sortWithSimplifiedMandarin(voiceNames)
    if (gender === 'male') {
      supplementaryTranslateForMale(voiceNames)
    }
    if (gender === 'female') {
      supplementaryTranslateForFemale(voiceNames)
    }
  }
}

function sortWithMultilingual(voiceNames: VoiceName[]) {
  voiceNames.sort((a: VoiceName, b: VoiceName) => {
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

function sortWithSimplifiedMandarin(voiceNames: VoiceName[]) {
  voiceNames.sort((a, b) => {
    if (a.value.includes('XiaoxiaoMultilingualNeural')) return -1
    if (b.value.includes('XiaoxiaoMultilingualNeural')) return 1
    return 0
  })
}

function supplementaryTranslateForMale(voiceNames: VoiceName[]) {
  voiceNames.forEach(item => {
    switch (item.value) {
      case 'zh-CN-YunxiaoMultilingualNeural':
        item.label = '云霄 多语言'
        break
      case 'zh-CN-YunfanMultilingualNeural':
        item.label = '云帆 多语言'
        break
      case 'zh-CN-Yunxiao:DragonHDFlashLatestNeural':
        item.label = '云霄 Dragon HD Flash'
        break
      case 'zh-CN-Yunye:DragonHDFlashLatestNeural':
        item.label = '云野 Dragon HD Flash'
        break
      case 'zh-CN-Yunyi:DragonHDFlashLatestNeural':
        item.label = '云逸 Dragon HD Flash'
        break
      case 'zh-CN-Yunfan:DragonHDLatestNeural':
        item.label = '云帆 Dragon HD'
        break
    }
  })
}

function supplementaryTranslateForFemale(voiceNames: VoiceName[]) {
  voiceNames.forEach(item => {
    switch (item.value) {
      case 'zh-CN-Xiaochen:DragonHDLatestNeural':
        item.label = '晓辰 Dragon HD'
        break
      case 'zh-CN-Xiaochen:DragonHDFlashLatestNeural':
        item.label = '晓辰 Dragon HD Flash'
        break
      case 'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural':
        item.label = '晓晓 Dragon HD Flash'
        break
      case 'zh-CN-Xiaoxiao2:DragonHDFlashLatestNeural':
        item.label = '晓晓2 Dragon HD Flash'
        break
    }
  })
}

export function generateSSML(data: { input: string; config: Config }, compression: boolean = true): string {
  const { input, config } = data
  const { lang, voiceName, style, styleDegree, role, volume, rate, pitch, gender } = config
  const styleProperty = style ? ` style="${style}"` : ''
  const styleDegreeProperty = styleDegree ? ` styleDegree="${styleDegree}"` : ''
  const roleProperty = role ? ` role="${role}"` : ''
  const volumeProperty = ` volume="${volume}%"`
  const rateProperty = ` rate="${rate}%"`
  const pitchProperty = ` pitch="${pitch}%"`
  const inputWithStop = input.replace(/{{⏱️=(\d+)}}/g, '<break time="$1ms"/>')
  const genderAttribute = compression ? '' : ` data-gender="${gender}"`
  let SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}"${genderAttribute}>
    <voice name="${voiceName}">
        <mstts:express-as${roleProperty}${styleProperty}${styleDegreeProperty}>
            <prosody${volumeProperty}${rateProperty}${pitchProperty}>${inputWithStop}</prosody>
        </mstts:express-as>
    </voice>
</speak>`

  if (compression) {
    SSML = SSML.replace(/\>\s+\</g, '><')
  }

  return SSML
}

export function parseSSML(ssml: string): { config: Partial<Config>; input: string } {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(ssml, 'text/xml')

  const config: Partial<Config> = {}

  // Extract language and gender
  const speakElement = xmlDoc.getElementsByTagName('speak')[0]
  config.lang = speakElement.getAttribute('xml:lang') || ''
  config.gender = speakElement.getAttribute('data-gender') || ''

  // Extract voice name
  const voiceElement = xmlDoc.getElementsByTagName('voice')[0]
  config.voiceName = voiceElement.getAttribute('name') || ''

  // Extract express-as attributes
  const expressAsElement = xmlDoc.getElementsByTagName('mstts:express-as')[0]
  if (expressAsElement) {
    config.role = expressAsElement.getAttribute('role') || ''
    config.style = expressAsElement.getAttribute('style') || ''
    config.styleDegree = parseFloat(expressAsElement.getAttribute('styleDegree') || '1')
  }

  // Extract prosody attributes
  const prosodyElement = xmlDoc.getElementsByTagName('prosody')[0]
  if (prosodyElement) {
    config.volume = parseInt(prosodyElement.getAttribute('volume') || '0')
    config.rate = parseInt(prosodyElement.getAttribute('rate') || '0')
    config.pitch = parseInt(prosodyElement.getAttribute('pitch') || '0')
  }

  // Extract input text and handle break tags
  const prosodyContent = prosodyElement?.innerHTML || ''
  const input = prosodyContent
    .replace(/<break(?:\s+xmlns="[^"]*")?\s+time="(\d+)ms"(?:\s*\/)?\s*>/g, '{{⏱️=$1}}')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  return { config, input }
}

export function getFormatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}
