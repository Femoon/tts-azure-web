import { AZURE_LIST_ENDPOINT } from '@/app/lib/constants'
import { getGenders, processVoiceName } from '@/app/lib/tools'
import { GenderItem, LangsItem, ListItem, ProcessedVoiceData, VoiceName } from '@/app/lib/types'

import 'server-only'

function processVoiceData(rawList: ListItem[]): ProcessedVoiceData {
  // get language options
  const languageMap = new Map()
  rawList.forEach(item => {
    languageMap.set(item.Locale, item.LocaleName)
  })
  const languages: LangsItem[] = [...languageMap].map(([value, label]) => ({ label, value }))

  // get gender options by language
  const gendersByLang: Record<string, GenderItem[]> = {}
  languages.forEach(({ value: lang }) => {
    const itemsForLang = rawList.filter(item => item.Locale === lang)
    gendersByLang[lang] = getGenders(itemsForLang)
  })

  // get voice names by language and gender
  const voicesByLangGender: Record<string, Record<string, VoiceName[]>> = {}
  const stylesAndRoles: Record<string, { styles: string[]; roles: string[] }> = {}

  languages.forEach(({ value: lang }) => {
    voicesByLangGender[lang] = {}
    const gendersForLang = gendersByLang[lang]

    gendersForLang.forEach(({ value: gender }) => {
      const selectedConfigs = rawList.filter(item => item.Locale === lang && item.Gender.toLowerCase() === gender)

      const voiceNames: VoiceName[] = selectedConfigs.map(item => ({
        label: item.LocalName,
        value: item.ShortName,
        hasStyle: !!item.StyleList?.length,
        hasRole: !!item.RolePlayList?.length,
      }))

      // process voice names
      processVoiceName(voiceNames, gender, lang)
      voicesByLangGender[lang][gender] = voiceNames

      // get styles and roles
      selectedConfigs.forEach(item => {
        stylesAndRoles[item.ShortName] = {
          styles: item.StyleList || [],
          roles: item.RolePlayList || [],
        }
      })
    })
  })

  return {
    languages,
    gendersByLang,
    voicesByLangGender,
    stylesAndRoles,
  }
}

export async function fetchList(): Promise<ProcessedVoiceData> {
  const res = await fetch(AZURE_LIST_ENDPOINT, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY!,
    },
    cache: 'force-cache',
    next: {
      revalidate: 60 * 60 * 24, // cache 24 hours
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch voice list: ${res.status}`)
  }

  const rawList: ListItem[] = await res.json()
  return processVoiceData(rawList)
}
