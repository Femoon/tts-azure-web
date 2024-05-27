import { Textarea } from '@nextui-org/input'
import { InputTextProps } from '@/app/lib/types'

export default function inputText({ t, input, setInput }: InputTextProps) {
  return (
    <Textarea
      size="lg"
      disableAutosize
      classNames={{
        input: 'resize-y min-h-[120px]',
      }}
      placeholder={t['input-text']}
      value={input}
      onChange={e => setInput(e.target.value)}
    />
  )
}
