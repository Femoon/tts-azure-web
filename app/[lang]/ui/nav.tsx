'use client'
import { useEffect, useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { langs } from '../../lib/constants'
import LanguageIcon from './components/icon'
import { ThemeToggle } from './components/theme-toggle'
import { Locale } from '@/i18n-config'

export default function Nav() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['cn']))

  const router = useRouter()
  const pathname = usePathname()

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
  const handleClickTitle = () => {
    router.refresh()
  }

  return (
    <div className="w-full px-6 h-16 flex sticky top-0 items-center justify-between z-[100] border-b border-light-border dark:border-dark-border bg-nav-light dark:bg-nav-dark">
      <div className="cursor-pointer select-none" onClick={handleClickTitle}>
        TTS Web
      </div>
      <div className="flex items-center gap-3">
        <Dropdown>
          <DropdownTrigger>
            <div className="p-3 cursor-pointer hover:text-[#0ea5e9]">
              <LanguageIcon />
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
