'use client'
import { useEffect, useMemo, useState } from 'react'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { langs } from '../../lib/constants'
import { ThemeToggle } from './theme-toggle'
import { Locale } from '@/i18n-config'

export default function Nav() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['cn']))

  const router = useRouter()
  const pathname = usePathname()

  const selectedValue = useMemo(() => {
    const key = Array.from(selectedKeys).join(', ').replaceAll('_', ' ')
    return langs.find(item => item.value === key)?.label
  }, [selectedKeys])

  useEffect(() => {
    const locale = pathname.split('/')[1]
    setSelectedKeys(new Set([locale]))
  }, [pathname])

  function handleSelectionChange(key: Selection) {
    setSelectedKeys(key)
    const redirectedPathname = (locale: Locale) => {
      if (!pathname) return
      const segments = pathname.split('/')
      if (segments[1] !== locale) {
        segments[1] = locale
      }
      return segments.join('/')
    }
    const locale = Array.from(key)[0] as Locale
    const newPath = redirectedPathname(locale)
    if (newPath && newPath !== pathname) {
      router.push(newPath)
    }
  }

  return (
    <div className="w-full px-6 h-16 flex sticky top-0 items-center justify-between z-[100] border-b border-light-border dark:border-dark-border bg-nav-light dark:bg-nav-dark">
      <div className="cursor-pointer select-none">Home</div>
      <div className="flex items-center gap-6">
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <div>{selectedValue}</div>
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={selectedKeys}
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

        <ThemeToggle />
      </div>
    </div>
  )
}
