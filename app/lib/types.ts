import { Key } from 'react'
import { getDictionary } from '@/get-dictionary'

export interface ListItem {
  Name: string
  DisplayName: string
  LocalName: string
  ShortName: string
  Gender: string
  Locale: string
  LocaleName: string
  StyleList?: string[]
  SampleRateHertz: string
  VoiceType: string
  Status: string
  ExtendedPropertyMap?: ExtendedPropertyMap
  WordsPerMinute: string
  SecondaryLocaleList?: string[]
  RolePlayList?: string[]
}

interface ExtendedPropertyMap {
  IsHighQuality48K: string
}

export interface LangsItem {
  label: string
  value: string
}

export interface LanguageSelectProps {
  t: Awaited<ReturnType<typeof getDictionary>>
  langs: LangsItem[]
  selectedLang: string
  handleSelectLang: (value: Key | null) => void
}
