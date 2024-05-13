'use client'
import { useState } from 'react'
import { faCircleHalfStroke, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from '@nextui-org/react'
import { langs } from '../lib/constants'

export default function Nav() {
  const [selectedKey, setSelectedKey] = useState<Selection>(new Set(['cn']))
  const selectedLabel = langs.find(item => item.value === [...selectedKey][0])?.label || ''

  function handleSelectionChange(key: Selection) {
    if (key instanceof Set && !key.size) return
    setSelectedKey(key)
  }
  return (
    <div className="w-full px-6 h-16 flex sticky top-0 lg:relative items-center justify-between bg-slate-50">
      <div className="cursor-pointer select-none">Home</div>
      <div className="flex items-center gap-3">
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <div>{selectedLabel}</div>
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            selectionMode="single"
            selectedKeys={selectedKey}
            onSelectionChange={key => handleSelectionChange(key)}
          >
            {langs.map(item => {
              return (
                <DropdownItem key={item.value} value={item.value}>
                  {item.label}
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>

        <FontAwesomeIcon icon={faCircleHalfStroke} className="w-4 h-4 cursor-pointer p-2" />
      </div>
    </div>
  )
}
