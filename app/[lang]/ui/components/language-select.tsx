import { memo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'

import { LanguageSelectProps } from '../../../lib/types'

const LanguageSelect = ({ t, langs, selectedLang, handleSelectLang }: LanguageSelectProps) => {
  return (
    <Autocomplete
      label={t['select-language']}
      selectedKey={selectedLang}
      className="w-full"
      onSelectionChange={handleSelectLang}
    >
      {langs!.map(item => (
        <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export default memo(LanguageSelect)
