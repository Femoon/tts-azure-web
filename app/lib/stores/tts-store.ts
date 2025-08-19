import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Config, ListItem } from '@/app/lib/types'

interface ModeCache {
  config: Config
  input: string
}

interface SSMLModeCache {
  input: string
}

interface TTSState {
  // TTS config
  config: Config
  input: string

  // UI state
  isLoading: boolean
  isPlaying: boolean
  isSSMLMode: boolean

  // mode cache
  normalModeCache: ModeCache | null
  ssmlModeCache: SSMLModeCache | null

  // data
  voiceList: ListItem[]

  // Actions
  setConfig: (config: Partial<Config>) => void
  updateConfigField: <K extends keyof Config>(key: K, value: Config[K]) => void
  setInput: (input: string) => void
  setIsLoading: (loading: boolean) => void
  setIsPlaying: (playing: boolean) => void
  toggleSSMLMode: () => void
  setVoiceList: (list: ListItem[]) => void

  // reset config
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
      // initial state
      config: defaultConfig,
      input: '',
      isLoading: false,
      isPlaying: false,
      isSSMLMode: false,
      normalModeCache: null,
      ssmlModeCache: null,
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

      toggleSSMLMode: () =>
        set(state => {
          if (state.isSSMLMode) {
            const ssmlModeCache: SSMLModeCache = { input: state.input }

            const normalCache = state.normalModeCache
            return {
              isSSMLMode: false,
              ssmlModeCache,
              config: normalCache?.config || defaultConfig,
              input: normalCache?.input || '',
            }
          } else {
            const normalModeCache: ModeCache = {
              config: state.config,
              input: state.input,
            }

            const ssmlCache = state.ssmlModeCache
            return {
              isSSMLMode: true,
              normalModeCache,
              config: defaultConfig,
              input: ssmlCache?.input || '',
            }
          }
        }),

      setVoiceList: voiceList => set({ voiceList }),

      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'tts-storage', // localStorage key
      partialize: state => ({
        config: state.config,
        input: state.input,
        normalModeCache: state.normalModeCache,
        ssmlModeCache: state.ssmlModeCache,
        // note: isSSMLMode is not persisted, it will be reset to false every time the page is reloaded
      }),
    },
  ),
)
