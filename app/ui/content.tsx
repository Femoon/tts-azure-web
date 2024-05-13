'use client'
import { useEffect, useRef, useState } from 'react'
import { faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@nextui-org/button'
import { Textarea } from '@nextui-org/input'
// import textToSpeech from '../lib/api'
import { listSuffixUrl } from '../lib/constants'
import { filterAndDeduplicateByGender, saveAs } from '../lib/tools'
import { GenderItem, LangsItem, ListItem, VoiceNameItem } from '../lib/types'
import LanguageSelect from './language-select'

export default function Content() {
  const [input, setInput] = useState('你好，这是一段测试文字')
  const [isLoading, setLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState('female')
  const [langs, setLangs] = useState<LangsItem[]>([])
  const [list, setList] = useState<ListItem[]>([])
  const [genders, setGenders] = useState<GenderItem[]>([])
  const [voiceName, setVoiceName] = useState('')
  const [voiceNames, setVoiceNames] = useState<VoiceNameItem[]>([])
  const [selectedLang, setSelectedLang] = useState('zh-CN')
  const audioBufferRef = useRef<Uint8Array | null>(null)

  function handleSelectGender(e: React.MouseEvent<HTMLButtonElement>, gender: string) {
    setSelectedGender(gender)
  }

  function handleSelectLang(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!e.target.value) return
    setSelectedLang(e.target.value)
    const data = list?.filter(item => item.Locale === e.target.value)
    setGenders(filterAndDeduplicateByGender(data))
  }

  function handleDownload() {
    if (!audioBufferRef.current) return
    saveAs(
      new Blob([audioBufferRef.current]),
      new Date().toISOString().replace('T', ' ').replace(':', '_').split('.')[0] + '.mp3',
    )
  }

  useEffect(() => {
    let ignore = false
    async function getList() {
      if (ignore) return
      const res = await fetch(`https://${process.env.NEXT_PUBLIC_SPEECH_REGION}${listSuffixUrl}`, {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY!,
        },
      })
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

  async function play() {
    if (!input.length || isLoading) return

    setLoading(true)
    // const url = await textToSpeech(input, voiceName, selectedLang)
    // const audio = new Audio(url)
    // audio.play()
    // const speechConfig = SpeechConfig.fromSubscription(
    //   process.env.NEXT_PUBLIC_SPEECH_KEY!,
    //   process.env.NEXT_PUBLIC_SPEECH_REGION!,
    // )
    // speechConfig.speechSynthesisLanguage = selectedLang
    // speechConfig.speechSynthesisVoiceName = voiceName

    // const synthesizer = new SpeechSynthesizer(speechConfig)
    // synthesizer.SynthesisCanceled = (s, e) => {
    //   console.log('canceled')
    // }
    // synthesizerRef.current = synthesizer
    // synthesizerRef.current.speakTextAsync(
    //   input,
    //   res => {
    //     const { audioData } = res
    //     audioBufferRef.current = new Uint8Array(audioData)
    //     synthesizerRef.current?.close()
    //     setLoading(false)
    //   },
    //   err => {
    //     console.error(err)
    //     synthesizerRef.current?.close()
    //     setLoading(false)
    //   },
    // )
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
          <Button color={isLoading ? 'default' : 'primary'} onClick={play}>
            播放
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
                {item.label}
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
