import { ReactElement } from 'react'
import { PopoverTrigger } from '@heroui/popover'

export const IconPopoverTrigger = ({ label, children }: { label: string; children: ReactElement }) => {
  return (
    <PopoverTrigger>
      <span
        role="button"
        tabIndex={0}
        aria-label={label}
        className="inline-flex outline-none cursor-pointer text-blue-600 hover:text-blue-500 transition-colors"
      >
        {children}
      </span>
    </PopoverTrigger>
  )
}
