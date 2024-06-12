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
    >
      {props.icon && <div className="w-[20px] h-[20px] m-3 flex justify-center items-center">{props.icon}</div>}
    </button>
  )
})
IconButton.displayName = 'IconButton'

export default IconButton
