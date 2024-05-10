'use client'
import { Textarea } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { Button } from '@nextui-org/button'
import { langs, genders, listSuffixUrl } from '../lib/constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import {
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { saveAs } from '../lib/tools'

export default function Content() {
  const [input, setInput] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState('female')
  const audioBufferRef = useRef<Uint8Array | null>(null)

  function handleSelectGender(
    e: React.MouseEvent<HTMLButtonElement>,
    gender: string
  ) {
    setSelectedGender(gender)
  }

  function handleDownload() {
    if (!audioBufferRef.current) return
    saveAs(
      new Blob([audioBufferRef.current]),
      new Date()
        .toISOString()
        .replace('T', ' ')
        .replace(':', '_')
        .split('.')[0] + '.mp3'
    )
  }

  async function getList() {
    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_SPEECH_REGION}${listSuffixUrl}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY!,
        },
      }
    )
    const list = await res.json()
    console.log(list)
  }
  useEffect(() => {
    getList()
  }, [])

  function play() {
    if (!input.length || isLoading) return
    setLoading(true)
    const speechConfig = SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_SPEECH_REGION!
    )

    const synthesizer = new SpeechSynthesizer(speechConfig)
    synthesizer.speakTextAsync(
      input,
      res => {
        const { audioData } = res
        audioBufferRef.current = new Uint8Array(audioData)
        synthesizer?.close()
        setLoading(false)
      },
      err => {
        console.error(err)
        synthesizer?.close()
        setLoading(false)
      }
    )
  }

  return (
    <div className="grow overflow-y-auto flex justify-center gap-10 py-5 px-20">
      <div className="flex-1">
        <Textarea
          size="lg"
          minRows={10}
          placeholder="input text"
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
        <Select label="Select language" className="w-full">
          {langs.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <div className="pt-4 flex gap-2">
          {genders.map(item => (
            <Button
              color={selectedGender === item.value ? 'primary' : 'default'}
              onClick={e => handleSelectGender(e, item.value)}
              key={item.value}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="pt-10">
          <p>语音</p>
          <Button color="default">晓晨</Button>
        </div>

        <div className="pt-10">
          <p>情感</p>
          <Button color="default">助手</Button>
        </div>

        <div className="pt-10">
          <p>扮演</p>
          <Button color="default">扮演</Button>
        </div>
      </div>
    </div>
  )
}
