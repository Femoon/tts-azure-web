'use client'
import { useEffect, useRef, useState } from 'react'
import { faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
import { base64AudioToBlobUrl, filterAndDeduplicateByGender, saveAs } from '../lib/tools'
import { GenderItem, LangsItem, ListItem, VoiceNameItem } from '../lib/types'
import LanguageSelect from './language-select'

export default function Content() {
  const [input, setInput] = useState('你好，这是一段测试文字')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [selectedGender, setSelectedGender] = useState('female')
  const [langs, setLangs] = useState<LangsItem[]>([])
  const [list, setList] = useState<ListItem[]>([])
  const [genders, setGenders] = useState<GenderItem[]>([])
  const [voiceName, setVoiceName] = useState('')
  const [voiceNames, setVoiceNames] = useState<VoiceNameItem[]>([])
  const [selectedLang, setSelectedLang] = useState('zh-CN')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function handleSelectGender(e: React.MouseEvent<HTMLButtonElement>, gender: string) {
    setSelectedGender(gender)
  }

  function handleSelectLang(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!e.target.value) return
    setSelectedLang(e.target.value)
    const data = list?.filter(item => item.Locale === e.target.value)
    setGenders(filterAndDeduplicateByGender(data))
  }

  useEffect(() => {
    let ignore = false
    async function getList() {
      if (ignore) return
      const res = await fetch('/api/list')
      const data: ListItem[] = await res.json()
      setList(data)
      const map = new Map()
      data.forEach(item => {
        map.set(item.Locale, item.LocaleName)
      })
      const result = [...map].map(([value, label]) => ({ label, value }))
      setLangs(result)
    }
    getList()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const dataForSelectedLang = list.filter(item => item.Locale === selectedLang)
    setGenders(filterAndDeduplicateByGender(dataForSelectedLang))
    const dataForVoiceName = dataForSelectedLang.filter(item => item.Gender === selectedGender)
    setVoiceNames(dataForVoiceName.map(item => ({ label: item.LocalName, value: item.ShortName })))
  }, [list, selectedLang, selectedGender])

  async function fetchAudio() {
    const res = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, voiceName, selectedLang }),
    })
    return res.json()
  }

  async function play() {
    if (!input.length || isLoading) return
    setLoading(true)
    const { base64Audio } = await fetchAudio()
    setLoading(false)
    const url = base64AudioToBlobUrl(base64Audio)
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }
    setIsPlaying(true)
    audioRef.current?.play()
  }

  function pause() {
    audioRef.current?.pause()
    audioRef.current = null
    setIsPlaying(false)
  }

  async function handleDownload() {
    if (!audioRef.current || !audioRef.current.src) return
    const response = await fetch(audioRef.current.src)
    const blob = await response.blob()
    saveAs(blob, new Date().toISOString().replace('T', ' ').replace(':', '_').split('.')[0] + '.mp3')
  }

  return (
    <div className="grow overflow-y-auto flex justify-center gap-10 py-5 px-20">
      <div className="flex-1">
        <Textarea
          size="lg"
          minRows={10}
          placeholder="请输入文本"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <p className="text-right pt-2">0/7000</p>
        <div className="flex justify-between items-center pt-6">
          <FontAwesomeIcon
            icon={faCircleDown}
            className="w-8 h-8 text-blue-600 cursor-pointer"
            onClick={handleDownload}
          />
          <Button color={isLoading ? 'default' : 'primary'} onClick={isPlaying ? pause : play}>
            {isPlaying ? '暂停' : '播放'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <LanguageSelect langs={langs} selectedLang={selectedLang} handleSelectLang={handleSelectLang} />
        <div className="pt-4 flex gap-2">
          {genders.map(
            item =>
              item.show && (
                <Button
                  color={selectedGender === item.value ? 'primary' : 'default'}
                  onClick={e => handleSelectGender(e, item.value)}
                  key={item.value}
                >
                  {item.label}
                </Button>
              ),
          )}
        </div>
        <div className="pt-10">
          <p>语音</p>
          {voiceNames.map(item => {
            return (
              <Button
                key={item.value}
                color={item.value === voiceName ? 'primary' : 'default'}
                className="mt-4 mr-3"
                onClick={() => setVoiceName(item.value)}
              >
                {item.label.split(' ').join(' - ')}
              </Button>
            )
          })}
        </div>

        {/* <div className="pt-10">
          <p>情感</p>
          <Button color="default">助手</Button>
        </div>

        <div className="pt-10">
          <p>扮演</p>
          <Button color="default">扮演</Button>
        </div> */}
      </div>
    </div>
  )
}
