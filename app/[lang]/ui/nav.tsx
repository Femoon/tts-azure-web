'use client'
import { useEffect, useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from '@heroui/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { Locale } from '@/app/lib/i18n/i18n-config'
import { Tran } from '@/app/lib/types'

import Github from '../../icons/github.svg'
import Language from '../../icons/language.svg'
import Logo from '../../icons/logo.png'
import { GITHUB_URL, LANGS } from '../../lib/constants'

import IconButton from './components/icon-button'
import { ThemeToggle } from './components/theme-toggle'

export default function Nav({ t }: { t: Tran }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['cn']))

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const locale = pathname.split('/')[1]
    window.localStorage.setItem('browserLang', locale)
    setSelectedKeys(new Set([locale]))
  }, [pathname])

  const handleSelectionChange = (key: Selection) => {
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
      window.location.href = newPath
    }
  }

  const handleClickTitle = () => {
    router.refresh()
  }

  return (
    <div className="w-full px-6 h-16 flex sticky top-0 items-center justify-between z-[100] border-b border-nav-light dark:border-nav-dark bg-nav-light dark:bg-nav-dark">
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleClickTitle}>
        <Image src={Logo} alt="" width={24} height={24} />
        <p className="text-lg">Azure TTS Web</p>
      </div>
      <div className="flex items-center gap-1">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <IconButton
            icon={<Github />}
            title="Github"
            className="hover:text-[#0ea5e9] transition-colors duration-300"
          />
        </a>

        <Dropdown>
          <DropdownTrigger>
            <IconButton
              icon={<Language />}
              title={t['select-language-btn']}
              className="hover:text-[#0ea5e9] transition-colors duration-300"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="select language"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={selectedKeys}
            onSelectionChange={key => handleSelectionChange(key)}
          >
            {LANGS.map(item => {
              return (
                <DropdownItem key={item.value} value={item.value}>
                  {item.label}
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>

        <ThemeToggle t={t} />
      </div>
    </div>
  )
}
