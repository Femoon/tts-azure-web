'use client'
import { Key, useEffect, useMemo, useRef, useState } from 'react'
import { faCircleDown, faCirclePause, faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { base64AudioToBlobUrl, filterAndDeduplicateByGender, saveAs } from '../../lib/tools'
import { ListItem } from '../../lib/types'
import LanguageSelect from './components/language-select'
import { type getDictionary } from '@/get-dictionary'

export default function Content({ t, list }: { t: Awaited<ReturnType<typeof getDictionary>>; list: ListItem[] }) {
  const [input, setInput] = useState('我当时就心跳加速了，收到了重点大学的录取通知书，我太开心了')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [selectedGender, setSelectedGender] = useState('Female')
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [selectedLang, setSelectedLang] = useState('zh-CN')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheConfigRef = useRef<string | null>(null)

  const langs = useMemo(() => {
    const map = new Map()
    list.forEach(item => {
      map.set(item.Locale, item.LocaleName)
    })
    return [...map].map(([value, label]) => ({ label, value }))
  }, [list])

  const selectedConfigs = useMemo(() => {
    return list.filter(item => item.Locale === selectedLang)
  }, [list, selectedLang])

  const genders = useMemo(() => {
    return filterAndDeduplicateByGender(selectedConfigs)
  }, [selectedConfigs])

  const voiceNames = useMemo(() => {
    const dataForVoiceName = selectedConfigs.filter(item => item.Gender === selectedGender)
    return dataForVoiceName.map(item => ({ label: item.LocalName, value: item.ShortName }))
  }, [selectedGender, selectedConfigs])

  const { styles, roles } = useMemo(() => {
    const data = selectedConfigs.find(item => item.ShortName === selectedVoiceName)
    const { StyleList = [], RolePlayList = [] } = data || {}
    return { styles: StyleList, roles: RolePlayList }
  }, [selectedVoiceName, selectedConfigs])

  const handleSelectGender = (e: React.MouseEvent<HTMLButtonElement>, gender: string) => {
    setSelectedGender(gender)
  }

  const handleSelectLang = (value: Key | null) => {
    if (!value) return
    const lang = value.toString()
    setSelectedLang(lang)
    window.localStorage.setItem('lang', lang)
  }

  const handleSelectVoiceName = (voiceName: string) => {
    setSelectedVoiceName(voiceName)
    setSelectedStyle('')
    setSelectedRole('')
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      setSelectedLang(window.localStorage.getItem('lang') || 'zh-CN')
    }
  }, [list])

  // set default voice name
  useEffect(() => {
    if (voiceNames.length) {
      handleSelectVoiceName(voiceNames[0].value)
    }
  }, [voiceNames])

  const fetchAudio = async () => {
    const res = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, selectedLang, selectedGender, selectedVoiceName, selectedStyle, selectedRole }),
    })
    return res.json()
  }

  const play = async () => {
    if (!input.length || isLoading) return
    const cacheString = getCacheMark()
    if (cacheConfigRef.current === cacheString) {
      setIsPlaying(true)
      audioRef.current?.play()
      return
    }
    audioRef.current = null
    setLoading(true)

    try {
      const { base64Audio } = await fetchAudio()
      const url = base64AudioToBlobUrl(base64Audio)
      if (!audioRef.current) {
        audioRef.current = new Audio(url)
        audioRef.current.onended = () => {
          setIsPlaying(false)
        }
      }
      setIsPlaying(true)
      audioRef.current?.play()
      // save cache mark
      cacheConfigRef.current = cacheString
    } catch (err) {
      console.error('Error fetching audio:', err)
    } finally {
      setLoading(false)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const handleDownload = async () => {
    if (!audioRef.current || !audioRef.current.src) return
    const response = await fetch(audioRef.current.src)
    const blob = await response.blob()
    saveAs(blob, new Date().toISOString().replace('T', ' ').replace(':', '_').split('.')[0] + '.mp3')
  }

  const getCacheMark = () => {
    return input + selectedVoiceName + selectedLang + selectedStyle + selectedRole
  }

  return (
    <div className="grow overflow-y-auto flex md:justify-center gap-10 py-5 px-6 sm:px-10 md:px-10 lg:px-20 xl:px-40 2xl:px-50 flex-col md:flex-row">
      <div className="md:flex-1">
        <Textarea
          size="lg"
          disableAutosize
          classNames={{
            input: 'resize-y min-h-[120px]',
          }}
          placeholder={t['input-text']}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <p className="text-right pt-2">{input.length}/7000</p>
        <div className="flex justify-between items-center pt-6">
          <FontAwesomeIcon
            icon={faCircleDown}
            className="w-8 h-8 text-blue-600 cursor-pointer"
            onClick={handleDownload}
          />
          <FontAwesomeIcon
            icon={isPlaying ? faCirclePause : faCirclePlay}
            className={`w-8 h-8 text-blue-${isLoading ? '600/50' : '600'} cursor-pointer`}
            onClick={isPlaying ? pause : play}
          />
        </div>
      </div>

      <div className="md:flex-1 flex flex-col">
        <LanguageSelect t={t} langs={langs} selectedLang={selectedLang} handleSelectLang={handleSelectLang} />
        <div className="pt-4 flex gap-2">
          {genders.map(
            item =>
              item.show && (
                <Button
                  color={selectedGender === item.value ? 'primary' : 'default'}
                  onClick={e => handleSelectGender(e, item.value)}
                  key={item.value}
                >
                  {t[item.label]}
                </Button>
              ),
          )}
        </div>

        {/* voice */}
        <div className="pt-10">
          {langs.length ? <p>{t.voice}</p> : null}
          <div className="flex flex-wrap gap-2">
            {voiceNames.map(item => {
              return (
                <Button
                  key={item.value}
                  color={item.value === selectedVoiceName ? 'primary' : 'default'}
                  className="mt-2"
                  onClick={() => handleSelectVoiceName(item.value)}
                >
                  {item.label.split(' ').join(' - ')}
                </Button>
              )
            })}
          </div>
        </div>

        {/* style */}
        {selectedVoiceName && (
          <div className="pt-10">
            <p>{t.style}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                key="defaultStyle"
                color={selectedStyle === '' ? 'primary' : 'default'}
                className="mt-2"
                onClick={() => setSelectedStyle('')}
              >
                {t.default}
              </Button>
              {styles.map(item => {
                return (
                  <Button
                    key={item}
                    color={item === selectedStyle ? 'primary' : 'default'}
                    className="mt-2"
                    onClick={() => setSelectedStyle(item)}
                  >
                    {t.styles[item]}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* role */}
        {selectedVoiceName && (
          <div className="pt-10">
            <p>{t.role}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                key="defaultRole"
                color={selectedRole === '' ? 'primary' : 'default'}
                className="mt-2"
                onClick={() => setSelectedRole('')}
              >
                {t.default}
              </Button>
              {roles.map(item => {
                return (
                  <Button
                    key={item}
                    color={item === selectedRole ? 'primary' : 'default'}
                    className="mt-2"
                    onClick={() => setSelectedRole(item)}
                  >
                    {t.roles[item]}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
