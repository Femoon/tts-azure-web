import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Config, ListItem } from '@/app/lib/types'

interface TTSState {
  // TTS 配置
  config: Config
  input: string

  // UI 状态
  isLoading: boolean
  isPlaying: boolean

  // 数据
  voiceList: ListItem[]

  // Actions
  setConfig: (config: Partial<Config>) => void
  updateConfigField: <K extends keyof Config>(key: K, value: Config[K]) => void
  setInput: (input: string) => void
  setIsLoading: (loading: boolean) => void
  setIsPlaying: (playing: boolean) => void
  setVoiceList: (list: ListItem[]) => void

  // 重置配置
  resetConfig: () => void
}

const defaultConfig: Config = {
  gender: 'female',
  voiceName: '',
  lang: 'zh-CN',
  style: '',
  styleDegree: 1,
  role: '',
  rate: 0,
  volume: 0,
  pitch: 0,
}

export const useTTSStore = create<TTSState>()(
  persist(
    set => ({
      // 初始状态
      config: defaultConfig,
      input: '',
      isLoading: false,
      isPlaying: false,
      voiceList: [],

      // Actions
      setConfig: newConfig =>
        set(state => ({
          config: { ...state.config, ...newConfig },
        })),

      updateConfigField: (key, value) =>
        set(state => ({
          config: { ...state.config, [key]: value },
        })),

      setInput: input => set({ input }),

      setIsLoading: isLoading => set({ isLoading }),

      setIsPlaying: isPlaying => set({ isPlaying }),

      setVoiceList: voiceList => set({ voiceList }),

      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'tts-storage', // localStorage key
      partialize: state => ({
        config: state.config,
        input: state.input, // 持久化输入内容
      }),
    },
  ),
)
