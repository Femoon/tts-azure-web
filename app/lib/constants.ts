const region = process.env.NEXT_PUBLIC_SPEECH_REGION

export const azureTokenEndpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
export const azureListEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`
export const azureCognitiveEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`

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
    label: '女性',
    value: 'Female',
  },
  {
    label: '男性',
    value: 'Male',
  },
  {
    label: '中性',
    value: 'Neuter',
  },
]
