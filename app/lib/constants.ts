const region = process.env.SPEECH_REGION

export const azureTokenEndpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
export const azureListEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`
export const azureCognitiveEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
export const enText =
  'I just got back from the most incredible trip. It was a week-long adventure through the Italian countryside, starting in the bustling city of Rome. '
export const cnText = '人生是一场旅行，每段经历都是风景。珍惜当下，勇敢追梦。意义在于如何走过，而非走了多远。'

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
