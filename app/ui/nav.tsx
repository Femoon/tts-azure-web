'use client'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleHalfStroke,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons'
export default function Nav() {
  return (
    <div className="w-full px-6 h-16 flex sticky top-0 lg:relative items-center justify-between bg-slate-50">
      <div>menu</div>
      <div className="flex items-center gap-3">
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <div>中文</div>
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">中文</DropdownItem>
            <DropdownItem key="copy">英文</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <FontAwesomeIcon
          icon={faCircleHalfStroke}
          className="w-4 h-4 cursor-pointer p-2"
        />
      </div>
    </div>
  )
}
