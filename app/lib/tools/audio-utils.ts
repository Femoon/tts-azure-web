enum AudioFormat {
  MP3 = 'audio/mp3',
}

interface AudioProcessingOptions {
  format?: AudioFormat
}

const DEFAULT_AUDIO_OPTIONS: AudioProcessingOptions = {
  format: AudioFormat.MP3,
}

export function base64AudioToBlobUrl(
  base64Audio: string,
  options: AudioProcessingOptions = DEFAULT_AUDIO_OPTIONS,
): string {
  const opts = { ...DEFAULT_AUDIO_OPTIONS, ...options }

  try {
    const cleanBase64 = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '')

    const binaryString = atob(cleanBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: opts.format })
    return URL.createObjectURL(blob)
  } catch (error) {
    throw new Error(`Failed to convert base64 to blob URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
