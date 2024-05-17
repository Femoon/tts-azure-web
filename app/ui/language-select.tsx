import { Select, SelectItem } from '@nextui-org/select'
import { LanguageSelectProps } from '../lib/types'

export default function LanguageSelect({ langs, handleSelectLang }: LanguageSelectProps) {
  return (
    <Select label="请选择语言" defaultSelectedKeys={['zh-CN']} className="w-full" onChange={handleSelectLang}>
      {langs!.map(item => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  )
}
