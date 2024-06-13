import React, { forwardRef } from 'react'
import { useButton } from '@nextui-org/button'

const IconButton = forwardRef<
  HTMLButtonElement,
  {
    onClick?: () => void
    icon?: JSX.Element
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
        <div className="w-5 h-5 m-3 flex justify-center items-center">
          {React.cloneElement(props.icon, { className: 'w-full h-full' })}
        </div>
      )}
    </button>
  )
})
IconButton.displayName = 'IconButton'

export default IconButton
