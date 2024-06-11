# README

TTS-Azure-Web is a azure tts web page. You can run it locally or deploy it with one click, using your Azure Key.
Live demo: https://tts.femoon.top

## Getting Started

Get your API Key

- Go to [Microsoft Azure > Text to Speech](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/) and click "Try Text to Speech"
- Login
- Go to [Your APIS](https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/)
- In the "Speech services" block, click "Add"
- An endpoint and two subscription keys will be listed beside Speech Services.Add the endpoind and either one of the key to the `.env` file (you can use `.env.example` as reference) or set the corresponding environment variables.

Add environment configuration

```bash
 # your azure key
SPEECH_KEY=xxxxxxx
# your azure tts region
SPEECH_REGION=southeastasia
```

Run the development server:

```bash
# install dependencies
pnpm i
# run serve
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
