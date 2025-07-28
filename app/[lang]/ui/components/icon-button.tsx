import React, { forwardRef, ReactElement } from 'react'
import { useButton } from '@heroui/button'

const IconButton = forwardRef<
  HTMLButtonElement,
  {
    onClick?: () => void
    icon?: ReactElement
    className?: string
    title?: string
  }
>((props, ref) => {
  const { domRef, getButtonProps } = useButton({ ref, ...props })

  return (
    <button
      type="button"
      ref={domRef}
      {...getButtonProps()}
      title={props.title}
      onClick={props.onClick}
      className={`border-none outline-none cursor-pointer ${props.className}`}
      aria-label={props.title}
      aria-live="polite"
    >
      {props.icon && (
        <div className="m-3 flex justify-center items-center" style={{ width: '1.25rem', height: '1.25rem' }}>
          {React.cloneElement(props.icon, { style: { width: '100%', height: '100%' } } as any)}
        </div>
      )}
    </button>
  )
})
IconButton.displayName = 'IconButton'

export default IconButton
