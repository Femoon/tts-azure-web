const region = process.env.SPEECH_REGION

export const AZURE_TOKEN_ENDPOINT = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
export const AZURE_LIST_ENDPOINT = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`
export const AZURE_COGNITIVE_ENDPOINT = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`

export const GITHUB_URL = 'https://github.com/Femoon/tts-azure-web'

export const DEFAULT_TEXT = {
  EN: 'I just got back from the most incredible trip. It was a week-long adventure through the Italian countryside, starting in the bustling city of Rome. ',
  CN: '人生是一场旅行，每段经历都是风景。珍惜当下，勇敢追梦。意义在于如何走过，而非走了多远。',
}

export const langs = [
  {
    label: '中文',
    value: 'cn',
  },
  {
    label: 'English',
    value: 'en',
  },
]

export const genders = [
  {
    label: 'female',
    value: 'Female',
  },
  {
    label: 'male',
    value: 'Male',
  },
  {
    label: 'neuter',
    value: 'Neuter',
  },
]
