# TTS Azure Web

English / [简体中文](./README_CN.md)

TTS Azure Web is an Azure Text-to-Speech (TTS) web application built with Next.js 15 and React 19. Fine-tune the output speech results using Speech Synthesis Markup Language (SSML). It allows you to run it locally or deploy it with a single click using your Azure Key.

## Key Features

### Core Functionality

- **Voice Customization**: Selection of voice, language, style, and character
- **Audio Controls**: Adjustments of speech speed, intonation, and volume
- **Audio Export**: Download generated audio files
- **Dual Mode System**: Switch between Normal mode (UI controls) and SSML mode (direct markup)
- **Configuration Management**: Import and export SSML configurations

### Technical Features

- **Modern Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Responsive UI**: HeroUI (NextUI v2) with Tailwind CSS v4 and Framer Motion
- **Internationalization**: Built-in i18n support (English/Chinese) with automatic locale detection
- **State Management**: Zustand with persistent storage and mode switching
- **Multiple Deployment Options**: Vercel, Docker, or local development

This application is ideal for those looking to minimize setup while experiencing the full capabilities of Azure TTS.

Live demo: https://tts.femoon.top

## Getting Started

Get your API Key

- Go to [Microsoft Azure Text to Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech/) and click "Try Text to Speech Free"
- Go to [Azure AI services](https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/SpeechServices)
- In the "Speech services" block, click "Add"
- A region and two subscription keys will be listed beside Speech Services. You only need one key and its corresponding region.

## Deployment Options

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFemoon%2Ftts-azure-web&env=SPEECH_KEY&env=SPEECH_REGION&project-name=tts-azure-web&repository-name=tts-azure-web)

### Docker Deployment

```bash
# Build the Docker image
docker build -t tts-azure-web .

# Run with environment variables
docker run -p 3000:3000 \
  -e SPEECH_KEY=your_azure_key \
  -e SPEECH_REGION=your_azure_region \
  tts-azure-web
```

### Local Production Deployment

```bash
# Install yarn (if not already installed)
npm i -g yarn

# Install dependencies
yarn

# Build for production
yarn build

# Start production server
yarn start
```

## Development

### Environment Setup

Before starting development, create a `.env.local` file at the project root with your Azure credentials:

```bash
# Required: Azure Cognitive Services credentials
SPEECH_KEY=your_azure_key
SPEECH_REGION=your_azure_region

# Optional: Application configuration
NEXT_PUBLIC_MAX_INPUT_LENGTH=4000  # Maximum text input length (default: 4000)

# Optional: Next.js configuration
NEXT_TELEMETRY_DISABLED=1         # Disable Next.js telemetry
```

**Common Azure regions**: `eastus`, `westus2`, `eastasia`, `westeurope`, etc.

### Development Server

```bash
# Install yarn (if not already installed)
npm i -g yarn

# Install dependencies
yarn

# Start development server (localhost only)
yarn dev

# Or start development server accessible on LAN
yarn lan-dev
```

- **Local development**: Open [http://localhost:3000](http://localhost:3000/)
- **LAN development**: Access via your machine's IP address on port 3000

### Development Commands

```bash
yarn dev       # Start development server
yarn lan-dev   # Start development server on LAN (0.0.0.0)
yarn build     # Build for production
yarn start     # Start production server
yarn lint      # Run ESLint with auto-fix (max 0 warnings)
```

## Architecture Overview

### Technology Stack

- **Frontend**: React 19 with TypeScript
- **Framework**: Next.js 15 with App Router
- **UI Library**: HeroUI (NextUI v2) + Tailwind CSS v4 + Framer Motion
- **State Management**: Zustand with persistence middleware
- **Internationalization**: Built-in Next.js i18n with locale detection
- **Speech Service**: Microsoft Azure Cognitive Services Speech SDK

### Project Structure

```
app/
├── [lang]/              # Internationalized routes (en/cn)
│   ├── ui/             # UI components
│   │   └── components/ # Reusable components
│   └── page.tsx        # Main application page
├── api/                # API routes
│   ├── audio/         # TTS audio generation
│   ├── token/         # Azure authentication
│   └── list/          # Voice list fetching
└── lib/               # Utilities and stores
    ├── stores/        # Zustand state management
    ├── hooks/         # Custom React hooks
    └── i18n/          # Internationalization config
```

### Key Features

- **Dual Mode System**: Toggle between Normal mode (UI controls) and SSML mode (direct markup)
- **State Persistence**: Automatic localStorage sync for user preferences and configurations
- **Mode Switching**: Seamless switching between modes with state caching
- **Responsive Design**: Mobile-first design with adaptive layouts

## Contributing

### Git Commit Convention

This project follows the Conventional Commits specification:

- `feat`: Add new functions
- `fix`: Fix issues/bugs
- `perf`: Optimize performance
- `style`: Change code style without affecting functionality
- `refactor`: Refactor code
- `revert`: Undo changes
- `test`: Test related, does not involve business code changes
- `docs`: Documentation and annotations
- `chore`: Update dependencies/modify configuration
- `ci`: CI/CD related changes

### Development Workflow

1. **Pre-commit hooks**: Husky runs ESLint and Prettier on staged files
2. **Linting**: ESLint with TypeScript, Prettier, and import ordering rules
3. **Commit validation**: Commitlint enforces conventional commit messages
4. **Code quality**: Maximum 0 ESLint warnings allowed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Live Demo**: [https://tts.femoon.top](https://tts.femoon.top)
- **Issues**: [GitHub Issues](https://github.com/Femoon/tts-azure-web/issues)
- **Repository**: [GitHub Repository](https://github.com/Femoon/tts-azure-web)

## Acknowledgments

- [Microsoft Azure Cognitive Services](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech/) for providing the TTS service
- [Next.js](https://nextjs.org/) for the React framework
- [HeroUI](https://heroui.com/) for the component library
