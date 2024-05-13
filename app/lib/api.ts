// import axios from 'axios'

// const azureTokenEndpoint = `https://${process.env.NEXT_PUBLIC_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`

// const cognitiveRequest = axios.create({
//   baseURL: azureTokenEndpoint,
//   headers: {
//     'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SPEECH_KEY,
//   },
// })
// async function getToken(): Promise<string> {
//   try {
//     const response = await cognitiveRequest.post('', {}, {})
//     const accessToken = response.data
//     return accessToken
//   } catch (error) {
//     console.error('Error getting token from Azure:', error)
//     throw error
//   }
// }

// const azureTTS = axios.create({
//   baseURL: `https://${process.env.NEXT_PUBLIC_SPEECH_REGION}.tts.speech.microsoft.com/`,
//   headers: {
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'application/ssml+xml',
//     // 'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
//   },
// })

// export default async function textToSpeech(text: string, voice: string, lang: string) {
// if (!window.localStorage.getItem('token')) {
// token = await getToken()
// console.log('🚀 ~ textToSpeech ~ token:', token)
//   window.localStorage.setItem('token', token)
// }
// const response = await azureTTS.post(
//   `cognitiveservices/v1`,
//   "<speak version='1.0' xml:lang='zh-CN'><voice xml:lang='zh-CN' xml:gender='Female' xml:style='' name='zh-CN-XiaochenMultilingualNeural'>213123213</voice></speak>",
//   // `<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'>${text}</voice></speak>`,
//   {
//     responseType: 'arraybuffer',
//   },
// )
// const audioBlob = new Blob([response.data], { type: 'audio/wav' })
// const audioUrl = URL.createObjectURL(audioBlob)
// return audioUrl
// }
