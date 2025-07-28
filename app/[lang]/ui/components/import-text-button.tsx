import { useState, ReactElement } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'
import { toast } from 'sonner'

import { DEFAULT_TEXT } from '@/app/lib/constants'
import { Tran } from '@/app/lib/types'

export const ImportTextButton = ({
  t,
  setInput,
  buttonIcon,
}: {
  t: Tran
  setInput: (text: string) => void
  buttonIcon: ReactElement
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const defaultTextKeys = Object.keys(DEFAULT_TEXT) as Array<keyof typeof DEFAULT_TEXT>

  return (
    <Popover placement="right" isOpen={isPopoverOpen} onOpenChange={open => setIsPopoverOpen(open)}>
      <PopoverTrigger>{buttonIcon}</PopoverTrigger>
      <PopoverContent>
        <div className="px-3 pt-2 text-left font-bold w-full select-none">{t['import-example-text']}</div>
        <ul className="px-1 py-2 w-full">
          {defaultTextKeys.map(item => {
            return (
              <li
                className="text-left text-tiny hover:bg-[#d4d4d8] dark:hover:bg-[#3f3f46] transition-colors cursor-pointer rounded-md p-2"
                key={item}
                onClick={() => {
                  setInput(DEFAULT_TEXT[item])
                  setIsPopoverOpen(false)
                  toast.success(t['import-example-text-success'])
                }}
              >
                {item === 'CN' ? '中文' : 'English'}
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
