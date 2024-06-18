# TTS Azure Web

English / [简体中文](./README_CN.md)

TTS Azure Web is an Azure Text-to-Speech (TTS) web application. It allows you to run it locally or deploy it with a single click using your Azure Key.

Key Features:

- Local and Cloud Deployment: Easily run the application on your local machine or deploy it to the cloud.
- One-Click Setup: Simplified deployment process using your Azure Key.
- Azure Integration: Leverages Azure's powerful TTS services for high-quality speech synthesis.

This application is ideal for those looking to minimize setup while experiencing the full capabilities of Azure TTS.

Live demo: https://tts.femoon.top

## Getting Started

Get your API Key

- Go to [Microsoft Azure > Text to Speech](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/) and click "Try Text to Speech"
- Login
- Go to [Your APIS](https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/)
- In the "Speech services" block, click "Add"
- A region and two subscription keys will be listed beside Speech Services. You only need one key and its corresponding region.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

## Development

Before starting development, you must create a new `.env.local` file at project root, and place your azure key and region into it:

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
