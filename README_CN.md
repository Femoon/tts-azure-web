# TTS Azure Web

[English](./README.md) / 简体中文

TTS Azure Web 是一个 Azure 文本转语音（TTS）网页应用。通过语音合成标记语言 (SSML) 对输出语音结果微调，可以在本地运行或使用你的 Azure Key 一键部署。

主要特性：

- 支持选择语音、语言、风格和角色
- 支持语速、语调、音量的调节
- 支持输出音频下载
- 本地和云端一键部署。
- 支持导入/导出 SSML 配置

该项目适合那些希望在体验 Azure TTS 全功能的同时最小化设置工作的用户。

在线演示： [https://tts.femoon.top/cn](https://tts.femoon.top/cn)

## 入门指南

获取你的 API 密钥

- 需要一张 VISA 卡
- 访问 [Microsoft Azure 文本转语音](https://azure.microsoft.com/zh-cn/products/ai-services/text-to-speech) 并点击“免费试用文本转语音”
- 访问 [Azure AI services](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/SpeechServices)
- 在“语音服务”块中，点击“创建”
- 创建成功后，在语音服务旁边将列出一个区域和两个订阅 Key 。你只需一个 Key 及其对应的区域

具体可以参考 [Bob](https://github.com/ripperhe/Bob) 官方申请 Azure TTS 的[图文教程](https://bobtranslate.com/service/tts/microsoft.html)，流程只需要到**获取完密钥**就可以了。

## 在 Vercel 上一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

## 在本地一键部署

```bash
# 安装 pnpm
npm i -g pnpm
# 安装依赖
pnpm i
# 构建生产环境
pnpm build
# 运行生产环境服务
pnpm start
```

## 开发

在开始开发之前，必须在项目根目录创建一个新的 `.env.local` 文件，并输入你的 Azure Key 和对应的地区：

```bash
# 你的 Azure Key (必填)
SPEECH_KEY=your_azure_key
# 你的 Azure 地区 (必填)
SPEECH_REGION=your_azure_region
# 输入框最大长度限制 (可选)
NEXT_PUBLIC_MAX_INPUT_LENGTH=4000
```

本地运行开发服务器：

```bash
# 安装 pnpm
npm i -g pnpm
# 安装依赖
pnpm i
# 运行服务器
pnpm run dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000/) 查看结果。

## Git 提交规范参考

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `ci` 持续集成相关
