import { useState, ReactElement } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'

import { TIMES } from '@/app/lib/constants'
import { Tran } from '@/app/lib/types'

export const StopTimeButton = ({
  t,
  insertTextAtCursor,
  buttonIcon,
}: {
  t: Tran
  insertTextAtCursor: (text: string) => void
  buttonIcon: ReactElement
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  return (
    <Popover placement="right" isOpen={isPopoverOpen} onOpenChange={open => setIsPopoverOpen(open)}>
      <PopoverTrigger>{buttonIcon}</PopoverTrigger>
      <PopoverContent>
        <div className="px-3 pt-2 text-left font-bold w-full select-none">{t['insert-pause']}</div>
        <ul className="px-1 py-2 w-full">
          {TIMES.map(time => {
            return (
              <li
                className="hover:bg-[#d4d4d8] dark:hover:bg-[#3f3f46] transition-colors cursor-pointer rounded-md p-2"
                key={time}
                onClick={() => {
                  insertTextAtCursor(`{{⏱️=${time}}}`)
                  setIsPopoverOpen(false)
                }}
              >
                {time} {' ms'}
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
