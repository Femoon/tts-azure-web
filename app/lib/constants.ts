const REGION = process.env.SPEECH_REGION

export const AZURE_TOKEN_ENDPOINT = `https://${REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`
export const AZURE_LIST_ENDPOINT = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`
export const AZURE_COGNITIVE_ENDPOINT = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

export const GITHUB_URL = 'https://github.com/Femoon/tts-azure-web'

export const MAX_INPUT_LENGTH = process.env.NEXT_PUBLIC_MAX_INPUT_LENGTH
  ? parseInt(process.env.NEXT_PUBLIC_MAX_INPUT_LENGTH, 10)
  : 4000

export const DEFAULT_TEXT = {
  CN: '我们需要加的是生抽、老抽、料酒、白糖还有一点点的醋、盐，然后把它翻炒均匀就可以了。接下来就是收汁的阶段了哈，我们加入适量的水淀粉翻炒到这个鸡丁上色，而且汤汁呢，稍稍已经比较浓稠，啊不会轻易的滑落。',
  EN: "Hmm, I'm not sure what to wear to the party tonight. I want to look nice, but I also want to be comfortable. Maybe I’ll wear my new dress and heels. Oh no, but what if my feet start hurting after a while? Maybe I should bring a pair of flats just in case.",
}

export const LANGS = [
  {
    label: '中文',
    value: 'cn',
  },
  {
    label: 'English',
    value: 'en',
  },
]

export const TIMES = ['200', '300', '500', '1000', '2000', '5000']
