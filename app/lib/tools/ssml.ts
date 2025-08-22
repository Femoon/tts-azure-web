import { Config } from '../types'

interface SSMLGenerationOptions {
  compression?: boolean
  includeGenderAttribute?: boolean
  validateInput?: boolean
}

interface SSMLParseResult {
  config: Partial<Config>
  input: string
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const DEFAULT_SSML_OPTIONS: SSMLGenerationOptions = {
  compression: true,
  includeGenderAttribute: false,
  validateInput: true,
}

const SSML_NAMESPACES = {
  SPEAK: 'http://www.w3.org/2001/10/synthesis',
  MSTTS: 'https://www.w3.org/2001/mstts',
} as const

export function generateSSML(
  data: { input: string; config: Config },
  options: SSMLGenerationOptions = DEFAULT_SSML_OPTIONS,
): string {
  const opts = { ...DEFAULT_SSML_OPTIONS, ...options }
  const { input, config } = data

  if (opts.validateInput) {
    const validation = validateSSMLInput(data)
    if (!validation.isValid) {
      throw new Error(`Invalid SSML input: ${validation.errors.join(', ')}`)
    }
  }

  const { lang, voiceName, style, styleDegree, role, volume, rate, pitch, gender } = config

  const styleProperty = style ? ` style="${escapeXmlAttribute(style)}"` : ''
  const styleDegreeProperty = styleDegree ? ` styleDegree="${styleDegree}"` : ''
  const roleProperty = role ? ` role="${escapeXmlAttribute(role)}"` : ''
  const volumeProperty = ` volume="${volume}%"`
  const rateProperty = ` rate="${rate}%"`
  const pitchProperty = ` pitch="${pitch}%"`

  const processedInput = processInputText(input)

  const genderAttribute =
    opts.includeGenderAttribute && !opts.compression ? ` data-gender="${escapeXmlAttribute(gender || '')}"` : ''

  let ssml = `<speak version="1.0" xmlns="${SSML_NAMESPACES.SPEAK}" xmlns:mstts="${SSML_NAMESPACES.MSTTS}" xml:lang="${escapeXmlAttribute(lang)}"${genderAttribute}>
    <voice name="${escapeXmlAttribute(voiceName)}">
        <mstts:express-as${roleProperty}${styleProperty}${styleDegreeProperty}>
            <prosody${volumeProperty}${rateProperty}${pitchProperty}>${processedInput}</prosody>
        </mstts:express-as>
    </voice>
</speak>`

  if (opts.compression) {
    ssml = compressSSML(ssml)
  }

  return ssml
}

export function parseSSML(ssml: string): SSMLParseResult {
  const result: SSMLParseResult = {
    config: {},
    input: '',
    isValid: true,
    errors: [],
    warnings: [],
  }

  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(ssml, 'text/xml')

    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      result.isValid = false
      result.errors.push('Invalid XML structure')
      return result
    }

    const speakElement = xmlDoc.getElementsByTagName('speak')[0]
    if (!speakElement) {
      result.errors.push('Missing speak element')
      result.isValid = false
      return result
    }

    result.config.lang = speakElement.getAttribute('xml:lang') || ''
    const genderAttr = speakElement.getAttribute('data-gender')
    if (genderAttr) {
      result.config.gender = genderAttr
    }

    const voiceElement = xmlDoc.getElementsByTagName('voice')[0]
    if (voiceElement) {
      result.config.voiceName = voiceElement.getAttribute('name') || ''
    } else {
      result.warnings.push('Missing voice element')
    }

    const expressAsElement = xmlDoc.getElementsByTagName('mstts:express-as')[0]
    if (expressAsElement) {
      const role = expressAsElement.getAttribute('role')
      const style = expressAsElement.getAttribute('style')
      const styleDegree = expressAsElement.getAttribute('styleDegree')

      if (role) result.config.role = role
      if (style) result.config.style = style
      if (styleDegree) result.config.styleDegree = parseFloat(styleDegree)
    }

    const prosodyElement = xmlDoc.getElementsByTagName('prosody')[0]
    if (prosodyElement) {
      const volumeAttr = prosodyElement.getAttribute('volume')
      const rateAttr = prosodyElement.getAttribute('rate')
      const pitchAttr = prosodyElement.getAttribute('pitch')

      if (volumeAttr) result.config.volume = parseInt(volumeAttr.replace('%', ''))
      if (rateAttr) result.config.rate = parseInt(rateAttr.replace('%', ''))
      if (pitchAttr) result.config.pitch = parseInt(pitchAttr.replace('%', ''))

      const prosodyContent = prosodyElement.innerHTML || ''
      result.input = processSSMLText(prosodyContent)
    } else {
      result.warnings.push('Missing prosody element')
    }
  } catch (error) {
    result.isValid = false
    result.errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

function processInputText(input: string): string {
  return input.replace(/\{\{⏱️=(\d+)\}\}/g, '<break time="$1ms"/>')
}

function processSSMLText(ssmlText: string): string {
  return ssmlText
    .replace(/<break(?:\s+xmlns="[^"]*")?\s+time="(\d+)ms"(?:\s*\/)?\s*>/g, '{{⏱️=$1}}')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function compressSSML(ssml: string): string {
  return ssml.replace(/>\s+</g, '><').trim()
}

function validateSSMLInput(data: { input: string; config: Config }): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const { input, config } = data

  if (typeof input !== 'string') {
    errors.push('Input must be a string')
  } else if (input.trim().length === 0) {
    warnings.push('Input text is empty')
  }

  if (!config || typeof config !== 'object') {
    errors.push('Config must be an object')
    return { isValid: false, errors, warnings }
  }

  const requiredFields = ['lang', 'voiceName']
  requiredFields.forEach(field => {
    if (!config[field as keyof Config] || typeof config[field as keyof Config] !== 'string') {
      errors.push(`Config.${field} is required and must be a string`)
    }
  })

  const numericFields = ['volume', 'rate', 'pitch', 'styleDegree']
  numericFields.forEach(field => {
    const value = config[field as keyof Config]
    if (value !== undefined && (typeof value !== 'number' || isNaN(value))) {
      errors.push(`Config.${field} must be a valid number`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
