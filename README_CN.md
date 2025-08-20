# TTS Azure Web

[English](./README.md) / 简体中文

TTS Azure Web 是基于 Next.js 15 和 React 19 构建的 Azure 文本转语音（TTS）网页应用。通过语音合成标记语言 (SSML) 对输出语音结果进行精细调节，支持本地运行或使用你的 Azure Key 一键部署。

## 主要特性

### 核心功能

- **语音自定义**：支持选择语音、语言、风格和角色
- **音频控制**：调节语速、语调、音量等参数
- **音频导出**：下载生成的音频文件
- **双模式系统**：在普通模式（UI控制）和SSML模式（直接输入SSML标签）之间切换
- **配置管理**：导入和导出SSML配置

### 技术特性

- **现代技术栈**：Next.js 15 + App Router、React 19、TypeScript
- **响应式UI**：HeroUI (NextUI v2) + Tailwind CSS v4 + Framer Motion
- **国际化支持**：内置 i18n 支持（中英双语），自动语言检测
- **状态管理**：Zustand 状态管理，支持持久化存储和模式切换
- **多种部署选项**：支持 Vercel、Docker 或本地开发

该项目适合那些希望在体验 Azure TTS 全功能的同时最小化设置工作的用户。

在线演示： [https://tts.femoon.top/cn](https://tts.femoon.top/cn)

## 入门指南

### 获取你的 API 密钥

- 需要一张 VISA 卡（用于免费试用）
- 访问 [Microsoft Azure 文本转语音](https://azure.microsoft.com/zh-cn/products/ai-services/text-to-speech) 并点击"免费试用文本转语音"
- 访问 [Azure AI services](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/SpeechServices)
- 在"语音服务"块中，点击"创建"
- 创建成功后，在语音服务旁边将列出一个区域和两个订阅密钥。你只需一个密钥及其对应的区域

具体可以参考 [Bob](https://github.com/ripperhe/Bob) 官方申请 Azure TTS 的[图文教程](https://bobtranslate.com/service/tts/microsoft.html)，流程只需要到**获取完密钥**就可以了。

## 部署选项

### 在 Vercel 上一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -t tts-azure-web .

# 使用环境变量运行
docker run -p 3000:3000 \
  -e SPEECH_KEY=你的Azure密钥 \
  -e SPEECH_REGION=你的Azure区域 \
  tts-azure-web
```

### 本地生产环境部署

```bash
# 安装 yarn（如果尚未安装）
npm i -g yarn

# 安装依赖
yarn

# 构建生产版本
yarn build

# 启动生产环境服务
yarn start
```

## 开发

### 环境配置

在开始开发之前，请在项目根目录创建 `.env.local` 文件，配置你的 Azure 凭据：

```bash
# 必需：Azure 认知服务凭据
SPEECH_KEY=你的Azure密钥
SPEECH_REGION=你的Azure区域

# 可选：应用程序配置
NEXT_PUBLIC_MAX_INPUT_LENGTH=4000  # 最大文本输入长度（默认：4000）

# 可选：Next.js 配置
NEXT_TELEMETRY_DISABLED=1         # 禁用 Next.js 遥测
```

**常见Azure区域**：`eastus`、`westus2`、`eastasia`、`westeurope` 等。

### 开发服务器

```bash
# 安装 yarn（如果尚未安装）
npm i -g yarn

# 安装依赖
yarn

# 启动开发服务器（仅本地访问）
yarn dev

# 或启动可在局域网访问的开发服务器
yarn lan-dev
```

- **本地开发**：打开 [http://localhost:3000](http://localhost:3000/)
- **局域网开发**：通过你机器的IP地址和端口3000访问

### 开发命令

```bash
yarn dev       # 启动开发服务器
yarn lan-dev   # 启动局域网开发服务器 (0.0.0.0)
yarn build     # 构建生产版本
yarn start     # 启动生产环境服务
yarn lint      # 运行 ESLint 自动修复（最多0个警告）
```

## 架构概述

### 技术栈

- **前端框架**：React 19 + TypeScript
- **应用框架**：Next.js 15 + App Router
- **UI 组件库**：HeroUI (NextUI v2) + Tailwind CSS v4 + Framer Motion
- **状态管理**：Zustand 持久化中间件
- **国际化**：内置 Next.js i18n，支持语言检测
- **语音服务**：Microsoft Azure 认知服务语音 SDK

### 项目结构

```
app/
├── [lang]/              # 国际化路由 (en/cn)
│   ├── ui/             # UI 组件
│   │   └── components/ # 可复用组件
│   └── page.tsx        # 主应用页面
├── api/                # API 路由
│   ├── audio/         # TTS 音频生成
│   ├── token/         # Azure 认证
│   └── list/          # 语音列表获取
└── lib/               # 工具函数和状态管理
    ├── stores/        # Zustand 状态管理
    ├── hooks/         # 自定义 React Hooks
    └── i18n/          # 国际化配置
```

### 核心特性

- **双模式系统**：在普通模式（UI控制）和SSML模式（直接标记）之间切换
- **状态持久化**：用户首选项和配置自动保存到 localStorage
- **模式切换**：在不同模式间无缝切换，状态缓存机制
- **响应式设计**：移动端优先的自适应布局

## 贡献指南

### Git 提交规范

本项目遵循约定式提交规范：

- `feat`：增加新的业务功能
- `fix`：修复业务问题/BUG
- `perf`：优化性能
- `style`：更改代码风格，不影响功能
- `refactor`：重构代码
- `revert`：撤销更改
- `test`：测试相关，不涉及业务代码更改
- `docs`：文档和注释相关
- `chore`：更新依赖/修改配置等
- `ci`：CI/CD 相关更改

### 开发工作流

1. **预提交钩子**：Husky 对暂存文件运行 ESLint 和 Prettier
2. **代码检查**：ESLint + TypeScript、Prettier 和导入排序规则
3. **提交验证**：Commitlint 强制执行约定式提交信息
4. **代码质量**：允许的 ESLint 警告数为 0

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 支持

- **在线演示**：[https://tts.femoon.top](https://tts.femoon.top)
- **问题反馈**：[GitHub Issues](https://github.com/Femoon/tts-azure-web/issues)
- **项目仓库**：[GitHub Repository](https://github.com/Femoon/tts-azure-web)

## 致谢

- [Microsoft Azure 认知服务](https://azure.microsoft.com/zh-cn/products/ai-services/text-to-speech/) 提供 TTS 服务
- [Next.js](https://nextjs.org/) 提供 React 框架
- [HeroUI](https://heroui.com/) 提供组件库
