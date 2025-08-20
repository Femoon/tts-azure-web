import { memo, useMemo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'

import { LangsItem, LanguageSelectProps } from '../../../lib/types'

const LanguageSelect = ({ t, langs, selectedLang, handleSelectLang }: LanguageSelectProps) => {
  const sortedLangs = useMemo(() => {
    if (!langs) return { priorityLangs: [], otherLangs: [] }

    // priority langs
    const priorityLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'es-US', 'fr-FR', 'de-DE']
    const priorityLangs: LangsItem[] = []
    const otherLangs: LangsItem[] = []

    // separate priority langs and other langs
    langs.forEach(lang => {
      if (priorityLanguages.includes(lang.value)) {
        priorityLangs.push(lang)
      } else {
        otherLangs.push(lang)
      }
    })

    // sort priority langs
    priorityLangs.sort((a, b) => {
      return priorityLanguages.indexOf(a.value) - priorityLanguages.indexOf(b.value)
    })

    return { priorityLangs, otherLangs }
  }, [langs])

  return (
    <Autocomplete
      label={t['select-language']}
      selectedKey={selectedLang}
      className="w-full"
      onSelectionChange={handleSelectLang}
    >
      {[
        // priority langs
        ...sortedLangs.priorityLangs.map(item => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>),
        // separator
        ...(sortedLangs.priorityLangs.length > 0 && sortedLangs.otherLangs.length > 0
          ? [
              <AutocompleteItem key="separator" isDisabled className="!cursor-default">
                <div className="w-full h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
              </AutocompleteItem>,
            ]
          : []),
        // other langs
        ...sortedLangs.otherLangs.map(item => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>),
      ]}
    </Autocomplete>
  )
}

export default memo(LanguageSelect)
