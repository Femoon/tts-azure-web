import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { LanguageSelectProps } from '../../lib/types'

export default function LanguageSelect({ langs, selectedLang, handleSelectLang }: LanguageSelectProps) {
  return (
    <Autocomplete label="请选择语言" selectedKey={selectedLang} className="w-full" onSelectionChange={handleSelectLang}>
      {langs!.map(item => (
        <AutocompleteItem key={item.value} value={item.value}>
          {item.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}
