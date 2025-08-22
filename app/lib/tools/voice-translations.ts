import { VoiceName } from '../types'

type VoiceTranslationMap = Record<string, string>

interface VoiceTranslations {
  male: VoiceTranslationMap
  female: VoiceTranslationMap
}

const VOICE_TRANSLATIONS: VoiceTranslations = {
  male: {
    'zh-CN-YunxiaoMultilingualNeural': '云霄 多语言',
    'zh-CN-YunfanMultilingualNeural': '云帆 多语言',
    'zh-CN-Yunxiao:DragonHDFlashLatestNeural': '云霄 Dragon HD Flash',
    'zh-CN-Yunye:DragonHDFlashLatestNeural': '云野 Dragon HD Flash',
    'zh-CN-Yunyi:DragonHDFlashLatestNeural': '云逸 Dragon HD Flash',
    'zh-CN-Yunfan:DragonHDLatestNeural': '云帆 Dragon HD',
  },
  female: {
    'zh-CN-Xiaochen:DragonHDLatestNeural': '晓辰 Dragon HD',
    'zh-CN-Xiaochen:DragonHDFlashLatestNeural': '晓辰 Dragon HD Flash',
    'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural': '晓晓 Dragon HD Flash',
    'zh-CN-Xiaoxiao2:DragonHDFlashLatestNeural': '晓晓2 Dragon HD Flash',
  },
}

type Gender = keyof VoiceTranslations

function isValidGender(gender: string): gender is Gender {
  return gender === 'male' || gender === 'female'
}

export function applyVoiceTranslations(voiceNames: VoiceName[], gender: string, lang: string = 'zh-CN'): void {
  if (lang !== 'zh-CN') {
    return
  }

  if (!isValidGender(gender)) {
    console.warn(`Invalid gender: ${gender}. Skipping translations.`)
    return
  }

  const translations = VOICE_TRANSLATIONS[gender]

  voiceNames.forEach(voice => {
    const translation = translations[voice.value]
    if (translation) {
      voice.label = translation
    }
  })
}
