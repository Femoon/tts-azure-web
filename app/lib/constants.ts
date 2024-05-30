const region = process.env.SPEECH_REGION

export const azureTokenEndpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
export const azureListEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`
export const azureCognitiveEndpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
export const enText =
  'I just got back from the most incredible trip. It was a week-long adventure through the Italian countryside, starting in the bustling city of Rome. '
export const cnText = '我当时就心跳加速了，收到了重点大学的录取通知书，我太开心了'

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
