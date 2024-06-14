'use client'
import { Key, useEffect, useMemo, useRef, useState } from 'react'
import {
  faCircleDown,
  faCirclePause,
  faCirclePlay,
  faRotateRight,
  faMicrophone,
  faFaceLaugh,
  faUserGroup,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { Slider, SliderValue } from '@nextui-org/slider'
import { Spinner } from '@nextui-org/spinner'
import { base64AudioToBlobUrl, filterAndDeduplicateByGender, saveAs } from '../../lib/tools'
import { ListItem } from '../../lib/types'
import LanguageSelect from './components/language-select'
import { DEFAULT_TEXT } from '@/app/lib/constants'
import { type getDictionary } from '@/get-dictionary'

export default function Content({ t, list }: { t: Awaited<ReturnType<typeof getDictionary>>; list: ListItem[] }) {
  const [input, setInput] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheConfigRef = useRef<string | null>(null)
  const [config, setConfig] = useState({
    gender: 'Female',
    voiceName: '',
    lang: 'zh-CN',
    style: '',
    styleDegree: 1,
    role: '',
    rate: 0,
    volume: 100,
    pitch: 0,
  })

  const langs = useMemo(() => {
    const map = new Map()
    list.forEach(item => {
      map.set(item.Locale, item.LocaleName)
    })
    return [...map].map(([value, label]) => ({ label, value }))
  }, [list])

  const selectedConfigs = useMemo(() => {
    return list.filter(item => item.Locale === config.lang)
  }, [list, config.lang])

  const genders = useMemo(() => {
    return filterAndDeduplicateByGender(selectedConfigs)
  }, [selectedConfigs])

  const voiceNames = useMemo(() => {
    const dataForVoiceName = selectedConfigs.filter(item => item.Gender === config.gender)
    return dataForVoiceName.map(item => {
      return {
        label: item.LocalName,
        value: item.ShortName,
        hasStyle: item.StyleList?.length,
        hasRole: item.RolePlayList?.length,
      }
    })
  }, [config.gender, selectedConfigs])

  const { styles, roles } = useMemo(() => {
    const data = selectedConfigs.find(item => item.ShortName === config.voiceName)
    const { StyleList = [], RolePlayList = [] } = data || {}
    return { styles: StyleList, roles: RolePlayList }
  }, [config.voiceName, selectedConfigs])

  const handleSelectGender = (e: React.MouseEvent<HTMLButtonElement>, gender: string) => {
    setConfig(prevConfig => ({ ...prevConfig, gender }))
  }

  const handleSelectLang = (value: Key | null) => {
    if (!value) return
    const lang = value.toString()
    setConfig(prevConfig => ({ ...prevConfig, lang }))
    window.localStorage.setItem('lang', lang)
  }

  const handleSlideStyleDegree = (value: SliderValue) => {
    if (typeof value === 'number') {
      setConfig(prevConfig => ({ ...prevConfig, styleDegree: value }))
    }
  }

  const handleSlideRate = (value: SliderValue) => {
    if (typeof value === 'number') {
      setConfig(prevConfig => ({ ...prevConfig, rate: value }))
    }
  }

  const handleSlideVolume = (value: SliderValue) => {
    if (typeof value === 'number') {
      setConfig(prevConfig => ({ ...prevConfig, volume: value }))
    }
  }

  const handleSlidePitch = (value: SliderValue) => {
    if (typeof value === 'number') {
      setConfig(prevConfig => ({ ...prevConfig, pitch: value }))
    }
  }

  const handleSelectVoiceName = (voiceName: string) => {
    setConfig(prevConfig => ({ ...prevConfig, voiceName, style: '', role: '' }))
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      const browserLang = window.localStorage.getItem('browserLang') === 'cn' ? 'zh-CN' : 'en-US'
      const lang = window.localStorage.getItem('lang') || browserLang || 'zh-CN'
      setConfig(prevConfig => ({ ...prevConfig, lang }))
      setInput(lang === 'zh-CN' ? DEFAULT_TEXT.CN : DEFAULT_TEXT.EN)
    }
  }, [list])

  // set default voice name when voiceNames changes
  useEffect(() => {
    if (voiceNames.length && !config.voiceName) {
      handleSelectVoiceName(voiceNames[0].value)
    }
  }, [voiceNames, config.voiceName])

  // set voiceName when gender changes
  useEffect(() => {
    if (voiceNames.length) {
      setConfig(prevConfig => ({ ...prevConfig, voiceName: voiceNames[0].value }))
    }
  }, [voiceNames, config.gender])

  const fetchAudio = async () => {
    const res = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, config }),
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
  const resetStyleDegree = () => {
    setConfig(prevConfig => ({ ...prevConfig, styleDegree: 1 }))
  }

  const resetRate = () => {
    setConfig(prevConfig => ({ ...prevConfig, rate: 0 }))
  }

  const resetVolume = () => {
    setConfig(prevConfig => ({ ...prevConfig, volume: 100 }))
  }

  const resetPitch = () => {
    setConfig(prevConfig => ({ ...prevConfig, pitch: 0 }))
  }

  const getCacheMark = () => {
    return input + Object.values(config).join('')
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
          {isLoading ? (
            <Spinner className="w-8 h-8" />
          ) : (
            <FontAwesomeIcon
              icon={isPlaying ? faCirclePause : faCirclePlay}
              className={`w-8 h-8 text-blue-${isLoading ? '600/50' : '600'} cursor-pointer`}
              onClick={isPlaying ? pause : play}
            />
          )}
        </div>
      </div>

      <div className="md:flex-1 flex flex-col">
        <LanguageSelect t={t} langs={langs} selectedLang={config.lang} handleSelectLang={handleSelectLang} />
        <div className="pt-4 flex gap-2">
          {genders.map(
            item =>
              item.show && (
                <Button
                  color={config.gender === item.value ? 'primary' : 'default'}
                  onClick={e => handleSelectGender(e, item.value)}
                  key={item.value}
                >
                  {t[item.label]}
                </Button>
              ),
          )}
        </div>

        <Accordion
          className="mt-3 px-0 rounded-medium bg-transparent"
          selectionMode="multiple"
          isCompact
          defaultExpandedKeys={['1', '2', '3']}
        >
          {/* voice */}
          <AccordionItem
            key="1"
            aria-label={t.voice}
            startContent={
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMicrophone} className="text-gray-500 cursor-pointer h-[1em]" />

                <p className="text-large">{t.voice}</p>
              </div>
            }
          >
            <div className="flex flex-wrap gap-2 pb-3">
              {voiceNames.map(item => {
                return (
                  <Button
                    key={item.value}
                    color={item.value === config.voiceName ? 'primary' : 'default'}
                    className="mt-1 gap-1 border-black"
                    onClick={() => handleSelectVoiceName(item.value)}
                  >
                    {item.label.split(' ').join(' - ')}
                    <div className="flex">
                      {item.hasStyle && (
                        <div
                          className={`border border-${item.value === config.voiceName ? 'white' : 'black'} dark:border-white rounded leading-4 px-1 scale-80`}
                        >
                          S
                        </div>
                      )}
                      {item.hasRole && (
                        <div
                          className={`border border-${item.value === config.voiceName ? 'white' : 'black'} dark:border-white rounded leading-4 px-1 scale-80`}
                        >
                          R
                        </div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </AccordionItem>

          {/* style */}
          <AccordionItem
            key="2"
            aria-label={t.style}
            startContent={
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faFaceLaugh} className="text-gray-500 cursor-pointer h-[1em]" />
                <p className="text-large">{t.style}</p>
              </div>
            }
          >
            <section className="flex items-center justify-between gap-20">
              <div className="flex flex-1 gap-5 items-center justify-end">
                <FontAwesomeIcon
                  icon={faRotateRight}
                  className="text-gray-500 cursor-pointer h-[1em]"
                  onClick={resetStyleDegree}
                />
                <Slider
                  size="sm"
                  step={0.01}
                  value={config.styleDegree}
                  maxValue={2}
                  minValue={0.01}
                  defaultValue={1}
                  aria-label="风格强度"
                  onChange={handleSlideStyleDegree}
                  classNames={{
                    track: 'border-s-primary-100',
                    filler: 'bg-gradient-to-r from-primary-100 to-primary-500',
                  }}
                />
                <p className="w-10">{config.styleDegree}</p>
              </div>
            </section>
            <div className="flex flex-wrap gap-2 pb-3">
              <Button
                key="defaultStyle"
                color={config.style === '' ? 'primary' : 'default'}
                className="mt-1"
                onClick={() => setConfig(prevConfig => ({ ...prevConfig, style: '' }))}
              >
                {t.default}
              </Button>
              {styles.map(item => {
                return (
                  <Button
                    key={item}
                    color={item === config.style ? 'primary' : 'default'}
                    className="mt-1"
                    onClick={() => setConfig(prevConfig => ({ ...prevConfig, style: item }))}
                  >
                    {t.styles[item]}
                  </Button>
                )
              })}
            </div>
          </AccordionItem>

          {/* role */}
          <AccordionItem
            key="3"
            aria-label={t.role}
            startContent={
              <div className="flex gap-3 items-center">
                <FontAwesomeIcon icon={faUserGroup} className="text-gray-500 cursor-pointer h-[1em]" />
                <p className="text-large">{t.role}</p>
              </div>
            }
          >
            <div className="flex flex-wrap gap-2 pb-3">
              <Button
                key="defaultRole"
                color={config.role === '' ? 'primary' : 'default'}
                className="mt-1"
                onClick={() => setConfig(prevConfig => ({ ...prevConfig, role: '' }))}
              >
                {t.default}
              </Button>
              {roles.map(item => {
                return (
                  <Button
                    key={item}
                    color={item === config.role ? 'primary' : 'default'}
                    className="mt-1"
                    onClick={() => setConfig(prevConfig => ({ ...prevConfig, role: item }))}
                  >
                    {t.roles[item]}
                  </Button>
                )
              })}
            </div>
          </AccordionItem>

          {/* Advanced settings */}
          <AccordionItem
            key="4"
            aria-label={t.advancedSettings}
            startContent={
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faSliders} className="text-gray-500 cursor-pointer h-[1em]" />
                <p className="text-large">{t.advancedSettings}</p>
              </div>
            }
          >
            {/* rate */}
            <div>
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="shrink-0">{t.rate}</p>
                  <FontAwesomeIcon icon={faRotateRight} className="text-gray-500 cursor-pointer" onClick={resetRate} />
                </div>
                <p>
                  {config.rate >= 0 && '+'}
                  {config.rate}%
                </p>
              </section>
              <Slider
                size="sm"
                step={10}
                value={config.rate}
                maxValue={200}
                minValue={-200}
                aria-label="风格强度"
                onChange={handleSlideRate}
                className="flex-1"
                classNames={{
                  base: 'gap-3',
                  track: 'border-s-primary-100',
                  filler: 'bg-gradient-to-r from-primary-100 to-primary-500',
                }}
              />
            </div>

            {/* pitch */}
            <div className="pt-5">
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="shrink-0">{t.pitch}</p>
                  <FontAwesomeIcon icon={faRotateRight} className="text-gray-500 cursor-pointer" onClick={resetPitch} />
                </div>
                <p>
                  {config.pitch >= 0 && '+'}
                  {config.pitch}%
                </p>
              </section>
              <Slider
                size="sm"
                step={1}
                value={config.pitch}
                minValue={-100}
                maxValue={100}
                aria-label={t.pitch}
                onChange={handleSlidePitch}
                classNames={{
                  track: 'border-s-primary-100',
                  filler: 'bg-gradient-to-r from-primary-100 to-primary-500',
                }}
              />
            </div>

            {/* volume */}
            <div className="pt-5 pb-3">
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="shrink-0">{t.volume}</p>
                  <FontAwesomeIcon
                    icon={faRotateRight}
                    className="text-gray-500 cursor-pointer"
                    onClick={resetVolume}
                  />
                </div>
                <p>{config.volume}%</p>
              </section>
              <Slider
                size="sm"
                step={1}
                value={config.volume}
                minValue={0}
                maxValue={200}
                aria-label={t.volume}
                onChange={handleSlideVolume}
                classNames={{
                  track: 'border-s-primary-100',
                  filler: 'bg-gradient-to-r from-primary-100 to-primary-500',
                }}
              />
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
