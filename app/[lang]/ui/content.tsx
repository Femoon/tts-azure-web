'use client'
import { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  faCircleDown,
  faCirclePause,
  faCirclePlay,
  faRotateRight,
  faMicrophone,
  faFaceLaugh,
  faUserGroup,
  faSliders,
  faFileLines,
  faStopwatch,
  faFileCode,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { Slider, SliderValue } from '@nextui-org/slider'
import { Spinner } from '@nextui-org/spinner'
import { Toaster, toast } from 'sonner'

import { DEFAULT_TEXT, MAX_INPUT_LENGTH } from '@/app/lib/constants'

import {
  base64AudioToBlobUrl,
  generateSSML,
  getFormatDate,
  getGenders,
  parseSSML,
  processVoiceName,
  saveAs,
} from '../../lib/tools'
import { Config, ListItem, Tran } from '../../lib/types'

import ConfigSlider from './components/config-slider'
import { ExportImportSettingsButton } from './components/export-import-setting-button'
import { ImportTextButton } from './components/import-text-button'
import LanguageSelect from './components/language-select'
import { StopTimeButton } from './components/stop-time-button'

export default function Content({ t, list }: { t: Tran; list: ListItem[] }) {
  const [input, setInput] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheConfigRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [config, setConfig] = useState<Config>({
    gender: 'female',
    voiceName: '',
    lang: 'zh-CN',
    style: '',
    styleDegree: 1,
    role: '',
    rate: 0,
    volume: 0,
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
    return getGenders(selectedConfigs)
  }, [selectedConfigs])

  const voiceNames = useMemo(() => {
    const dataForVoiceName = selectedConfigs.filter(item => item.Gender.toLowerCase() === config.gender)
    const _voiceNames = dataForVoiceName.map(item => {
      return {
        label: item.LocalName,
        value: item.ShortName,
        hasStyle: !!item.StyleList?.length,
        hasRole: !!item.RolePlayList?.length,
      }
    })

    processVoiceName(_voiceNames, config.gender, config.lang)

    return _voiceNames
  }, [config.gender, config.lang, selectedConfigs])

  const { styles, roles } = useMemo(() => {
    const data = selectedConfigs.find(item => item.ShortName === config.voiceName)
    const { StyleList = [], RolePlayList = [] } = data || {}
    return { styles: StyleList, roles: RolePlayList }
  }, [config.voiceName, selectedConfigs])

  useEffect(() => {
    if (voiceNames.length && (!config.voiceName || !voiceNames.some(v => v.value === config.voiceName))) {
      handleSelectVoiceName(voiceNames[0].value)
    }
  }, [config.gender, voiceNames, config.voiceName])

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
      // Set the user's language to the cookie
      document.cookie = `user-language=${lang}; path=/`

      setConfig(prevConfig => ({ ...prevConfig, lang }))
      setInput(lang.startsWith('zh') ? DEFAULT_TEXT.CN : DEFAULT_TEXT.EN)
    }
  }, [list])

  useEffect(() => {
    if (!genders.length || config.gender) return
    setConfig(prevConfig => ({ ...prevConfig, gender: genders[0].value }))
  }, [config.lang, genders, config.gender])

  useEffect(() => {
    if (voiceNames.length && !config.voiceName) {
      handleSelectVoiceName(voiceNames[0].value)
    }
  }, [voiceNames, config.voiceName])

  const fetchAudio = async () => {
    const res = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, config }),
    })
    if (!res.ok) {
      toast.error('Error fetching audio. Error code: ' + res.status)
    }
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
    if (!audioRef.current || !audioRef.current.src) {
      toast.warning(t['download-fail'])
      return
    }
    const response = await fetch(audioRef.current.src)
    const blob = await response.blob()
    saveAs(blob, `Azure-TTS-${getFormatDate(new Date())}.mp3`)
    toast.success(t['download-success'])
  }

  const handleInsertPause = async (text: string) => {
    try {
      await insertTextAtCursor(text)
      toast.success(t['insert-pause-success'])
    } catch {
      toast.success(t['insert-pause-fail'])
    }
  }

  const insertTextAtCursor = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const input = inputRef.current
      if (!input) {
        reject(new Error('Input element not found'))
        return
      }
      const start = input.selectionStart
      const end = input.selectionEnd
      const newValue = input.value.substring(0, start) + text + input.value.substring(end)
      setInput(newValue)

      setTimeout(() => {
        input.setSelectionRange(start + text.length, start + text.length)
        resolve()
      }, 0)
    })
  }

  const getExportData = () => {
    return generateSSML({ input, config }, false)
  }

  const resetStyleDegree = () => {
    setConfig(prevConfig => ({ ...prevConfig, styleDegree: 1 }))
  }

  const resetRate = () => {
    setConfig(prevConfig => ({ ...prevConfig, rate: 0 }))
  }

  const resetVolume = () => {
    setConfig(prevConfig => ({ ...prevConfig, volume: 0 }))
  }

  const resetPitch = () => {
    setConfig(prevConfig => ({ ...prevConfig, pitch: 0 }))
  }

  const getCacheMark: () => string = () => {
    return input + Object.values(config).join('')
  }

  const importSSMLSettings = useCallback(
    (ssml: string) => {
      try {
        const { config: importedConfig, input: importedInput } = parseSSML(ssml)
        setConfig(prevConfig => ({ ...prevConfig, ...importedConfig }))
        setInput(importedInput || '')
      } catch (error) {
        console.error('Error parsing SSML:', error)
        toast.error(t['import-ssml-settings-error'])
      }
    },
    [t],
  )

  return (
    <div className="grow overflow-y-auto flex md:justify-center gap-10 py-5 px-6 sm:px-10 md:px-10 lg:px-20 xl:px-40 2xl:px-50 flex-col md:flex-row">
      <div className="md:flex-1">
        <Toaster position="top-center" />
        {/* textarea */}
        <Textarea
          size="lg"
          disableAutosize
          classNames={{
            input: 'resize-y min-h-[120px] md:min-h-[170px]',
          }}
          ref={inputRef}
          placeholder={t['input-text']}
          value={input}
          maxLength={MAX_INPUT_LENGTH}
          onChange={e => setInput(e.target.value)}
        />
        <p className="text-right pt-2">
          {input.length}/{MAX_INPUT_LENGTH}
        </p>
        {/* icons */}
        <div className="flex justify-between items-center pt-3">
          <div className="flex gap-3">
            {/* download */}
            <FontAwesomeIcon
              title={t.download}
              titleId="faCircleDown"
              icon={faCircleDown}
              className="w-8 h-8 text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={handleDownload}
            />
            {/* import */}
            <ImportTextButton
              buttonIcon={
                <FontAwesomeIcon
                  title={t.import}
                  titleId="faFileArrowUp"
                  icon={faFileLines}
                  className="w-8 h-8 text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                />
              }
              t={t}
              setInput={setInput}
            />
            {/* stop time */}
            <StopTimeButton
              buttonIcon={
                <FontAwesomeIcon
                  title={t['insert-pause']}
                  titleId="faStopwatch"
                  icon={faStopwatch}
                  className="w-8 h-8 text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                />
              }
              t={t}
              insertTextAtCursor={handleInsertPause}
            />
            {/* export import settings */}
            <ExportImportSettingsButton
              buttonIcon={
                <FontAwesomeIcon
                  title={t['export-import-settings']}
                  titleId="faFileCode"
                  icon={faFileCode}
                  className="w-8 h-8 text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                />
              }
              t={t}
              getExportData={getExportData}
              importSSMLSettings={importSSMLSettings}
            />
          </div>

          {/* play */}
          {isLoading ? (
            <Spinner className="w-8 h-8" />
          ) : (
            <FontAwesomeIcon
              title={isPlaying ? t.pause : t.play}
              titleId={isPlaying ? 'faCirclePause' : 'faCirclePlay'}
              icon={isPlaying ? faCirclePause : faCirclePlay}
              className={`w-8 h-8 text-blue-${isLoading ? '600/50' : '600'} hover:text-blue-500 transition-colors cursor-pointer`}
              onClick={isPlaying ? pause : play}
            />
          )}
        </div>
      </div>
      {/* select language */}
      <div className="md:flex-1 flex flex-col">
        <LanguageSelect t={t} langs={langs} selectedLang={config.lang} handleSelectLang={handleSelectLang} />
        <div className="pt-4 flex gap-2">
          {genders.map(item => (
            <Button
              color={config.gender === item.value ? 'primary' : 'default'}
              onClick={e => handleSelectGender(e, item.value)}
              key={item.value}
            >
              {t[item.label]}
            </Button>
          ))}
        </div>

        <Accordion
          className="mt-3 px-0 rounded-medium bg-transparent"
          selectionMode="multiple"
          isCompact
          defaultExpandedKeys={['1', '2', '3', '4']}
        >
          {/* voice */}
          <AccordionItem
            key="1"
            aria-label={t.voice}
            startContent={
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMicrophone} className="text-gray-500 cursor-pointer w-[18px] h-[18px]" />

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
                <FontAwesomeIcon icon={faFaceLaugh} className="text-gray-500 cursor-pointer w-[18px] h-[18px]" />
                <p className="text-large">{t.style}</p>
              </div>
            }
          >
            <section className="flex items-center justify-between gap-20 mb-2">
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
                  aria-label={t.styleIntensity}
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
                    {(t.styles as any)[item] || item}
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
                <FontAwesomeIcon icon={faUserGroup} className="text-gray-500 cursor-pointer w-[18px] h-[18px]" />
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
                    {(t.roles as any)[item] || item}
                  </Button>
                )
              })}
            </div>
          </AccordionItem>

          {/* Advanced settings */}
          <AccordionItem
            key="4"
            aria-label={t.advancedSettings}
            classNames={{ content: 'overflow-x-hidden' }}
            startContent={
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faSliders} className="text-gray-500 cursor-pointer w-[18px] h-[18px]" />
                <p className="text-large">{t.advancedSettings}</p>
              </div>
            }
          >
            {/* rate */}
            <ConfigSlider
              label={t.rate}
              value={config.rate}
              minValue={-200}
              maxValue={200}
              onChange={handleSlideRate}
              reset={resetRate}
            />
            {/* pitch */}
            <ConfigSlider
              label={t.pitch}
              value={config.pitch}
              minValue={-100}
              maxValue={100}
              onChange={handleSlidePitch}
              reset={resetPitch}
            />
            {/* volume */}
            <ConfigSlider
              label={t.volume}
              value={config.volume}
              minValue={-100}
              maxValue={100}
              onChange={handleSlideVolume}
              reset={resetVolume}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
