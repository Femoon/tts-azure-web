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

export interface GenderItem {
  label: string
  value: string
  show: boolean
}

export interface VoiceNameItem {
  label: string
  value: string
}

export interface LanguageSelectProps {
  langs: LangsItem[]
  handleSelectLang: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
