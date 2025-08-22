import { VoiceName } from '../types'

interface VoicePriorityConfig {
  highPriority: string[]
  multilingualKeywords: string[]
  languageSpecific: Record<string, VoicePriorityConfig>
}

const DEFAULT_VOICE_PRIORITY: VoicePriorityConfig = {
  highPriority: [],
  multilingualKeywords: ['multilingual'],
  languageSpecific: {
    'zh-CN': {
      highPriority: ['XiaoxiaoMultilingualNeural'],
      multilingualKeywords: ['multilingual', 'Multilingual'],
      languageSpecific: {},
    },
  },
}

enum VoicePriority {
  HIGH = 1,
  MULTILINGUAL = 2,
  REGULAR = 3,
}

function getVoicePriority(voiceValue: string, config: VoicePriorityConfig = DEFAULT_VOICE_PRIORITY): VoicePriority {
  for (const highPriorityVoice of config.highPriority) {
    if (voiceValue.includes(highPriorityVoice)) {
      return VoicePriority.HIGH
    }
  }

  const lowerVoiceValue = voiceValue.toLowerCase()
  for (const keyword of config.multilingualKeywords) {
    if (lowerVoiceValue.includes(keyword.toLowerCase())) {
      return VoicePriority.MULTILINGUAL
    }
  }

  return VoicePriority.REGULAR
}

function getHighPriorityIndex(voiceValue: string, config: VoicePriorityConfig = DEFAULT_VOICE_PRIORITY): number {
  for (let i = 0; i < config.highPriority.length; i++) {
    if (voiceValue.includes(config.highPriority[i])) {
      return i
    }
  }
  return config.highPriority.length
}

function sortVoiceNames(
  voiceNames: VoiceName[],
  lang: string = '',
  config: VoicePriorityConfig = DEFAULT_VOICE_PRIORITY,
): void {
  const effectiveConfig =
    lang && config.languageSpecific[lang] ? { ...config, ...config.languageSpecific[lang] } : config

  voiceNames.sort((a: VoiceName, b: VoiceName) => {
    const aPriority = getVoicePriority(a.value, effectiveConfig)
    const bPriority = getVoicePriority(b.value, effectiveConfig)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    if (aPriority === VoicePriority.HIGH) {
      const aIndex = getHighPriorityIndex(a.value, effectiveConfig)
      const bIndex = getHighPriorityIndex(b.value, effectiveConfig)
      if (aIndex !== bIndex) {
        return aIndex - bIndex
      }
    }

    return a.label.localeCompare(b.label)
  })
}

export function sortVoiceNamesDefault(voiceNames: VoiceName[], lang: string = ''): void {
  sortVoiceNames(voiceNames, lang, DEFAULT_VOICE_PRIORITY)
}
