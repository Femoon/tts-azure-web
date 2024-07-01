# TTS Azure Web

[English](./README.md) / 简体中文

TTS Azure Web 是一个 Azure 文本转语音（TTS）网络应用。可以在本地运行或使用你的 Azure Key 一键部署。

主要特性：

- 本地和云端部署：可以轻松地在本地机器上运行应用程序或将其部署到云端。
- 一键设置：使用你的 Azure Key 简化部署过程。
- Azure 集成：利用 Azure 强大的 TTS 服务，实现高质量的语音合成。

该项目适合那些希望在体验 Azure TTS 全功能的同时最小化设置工作的用户。

在线演示： [https://tts.femoon.top/cn](https://tts.femoon.top/cn)

## 入门指南

获取你的 API 密钥

- 需要一张 VISA 卡
- 访问 [Microsoft Azure 文本转语音](https://azure.microsoft.com/zh-cn/products/ai-services/text-to-speech) 并点击“免费试用文本转语音”
- 访问 [Azure AI services](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/SpeechServices)
- 在“语音服务”块中，点击“创建”
- 创建成功后，在语音服务旁边将列出一个区域和两个订阅 Key 。你只需一个 Key 及其对应的区域

具体可以参考 [Bob](https://github.com/ripperhe/Bob) 官方申请 Azure TTS 的[图文教程]( https://bobtranslate.com/service/tts/microsoft.html)，流程只需要到**获取完密钥**就可以了。

## 在 Vercel 上一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

## 开发

在开始开发之前，必须在项目根目录创建一个新的 `.env.local` 文件，并将你的 Azure Key 和地区放入其中：

```bash
# 您的 Azure Key
SPEECH_KEY=xxxxxxx
# 您的 Azure TTS 地区
SPEECH_REGION=southeastasia
```

本地运行开发服务器：

```bash
# 安装依赖
pnpm i
# 运行服务器
pnpm run dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000/) 查看结果。
