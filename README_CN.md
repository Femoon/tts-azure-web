# TTS Azure Web

[English](./README.md) / 简体中文

TTS Azure Web 是一个 Azure 文本转语音（TTS）网络应用。它允许您在本地运行或使用您的 Azure 密钥一键部署。

主要特性：

- 本地和云端部署：可以轻松地在本地机器上运行应用程序或将其部署到云端。
- 一键设置：使用您的 Azure 密钥简化部署过程。
- Azure 集成：利用 Azure 强大的 TTS 服务，实现高质量的语音合成。

该应用程序适合那些希望在体验 Azure TTS 全功能的同时最小化设置工作的人。

在线演示： https://tts.femoon.top

## 入门指南

获取您的 API 密钥

- 访问 [Microsoft Azure > Text to Speech](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/) 并点击“试用文本转语音”
- 登录
- 访问 [您的 API](https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/)
- 在“语音服务”块中，点击“添加”
- 在语音服务旁边将列出一个区域和两个订阅密钥。您只需一个密钥及其对应的区域。

## 在 Vercel 上一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

## 开发

在开始开发之前，您必须在项目根目录创建一个新的 `.env.local` 文件，并将您的 Azure 密钥和区域放入其中：

```bash
# 您的 Azure 密钥
SPEECH_KEY=xxxxxxx
# 您的 Azure TTS 区域
SPEECH_REGION=southeastasia
```

运行开发服务器：

```bash
# 安装依赖
pnpm i
# 运行服务器
pnpm run dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000/) 查看结果。
