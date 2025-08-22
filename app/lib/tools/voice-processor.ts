import { VoiceName, GenderItem, ListItem } from '../types'

import { applyVoiceTranslations } from './voice-translations'
import { sortVoiceNamesDefault } from './voice-sorting'

function processVoiceNames(voiceNames: VoiceName[], gender: string, lang: string): void {
  sortVoiceNamesDefault(voiceNames, lang)

  applyVoiceTranslations(voiceNames, gender, lang)
}

function getGendersFromData(data: ListItem[]): GenderItem[] {
  const allGenders = data.map(item => item.Gender)
  const genderList = [...new Set(allGenders)]
  const genders = genderList.map(item => ({
    label: item.toLowerCase(),
    value: item.toLowerCase(),
  }))

  return genders
}

export function processVoiceName(voiceNames: VoiceName[], gender: string, lang: string): void {
  processVoiceNames(voiceNames, gender, lang)
}

export function getGenders(data: ListItem[]): GenderItem[] {
  return getGendersFromData(data)
}
