import { Select, SelectItem } from '@nextui-org/select'
import { LanguageSelectProps } from '../lib/types'

export default function LanguageSelect({ langs, selectedLang, handleSelectLang }: LanguageSelectProps) {
  return (
    <Select label="请选择语言" selectedKeys={[selectedLang]} className="w-full" onChange={handleSelectLang}>
      {langs!.map(item => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  )
}
