# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development
- `yarn dev` - Start development server
- `yarn lan-dev` - Start development server accessible on LAN (binds to 0.0.0.0)
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Lint and fix TypeScript/JavaScript files with ESLint (max 0 warnings)

### Environment Setup
Before development, create `.env.local` with:
```
SPEECH_KEY=your_azure_key
SPEECH_REGION=your_azure_region
NEXT_PUBLIC_MAX_INPUT_LENGTH=4000
```

## Architecture Overview

### Framework & Structure
- **Next.js 14** with App Router and TypeScript
- **Internationalization**: Built-in i18n with `[lang]` dynamic routes supporting English (`en`) and Chinese (`cn`)
- **UI Framework**: NextUI with Tailwind CSS and Framer Motion animations
- **Azure Integration**: Uses Microsoft Cognitive Services Speech SDK for TTS functionality

### Key Architectural Patterns

#### Internationalization Flow
- `middleware.ts` handles locale detection and routing
- `app/[lang]/` structure provides localized pages
- Locale detection uses browser headers and cookies with fallback
- Translation files in `locales/` directory (`en.json`, `cn.json`)

#### TTS Processing Pipeline
1. **Token Management**: `app/api/token/fetch-token.ts` - Handles Azure authentication
2. **Voice Data**: `app/api/list/fetch-list.ts` - Fetches available voices from Azure
3. **Audio Generation**: `app/api/audio/route.ts` - Converts text to speech using SSML
4. **SSML Generation**: `app/lib/tools.ts` - Creates Speech Synthesis Markup Language

#### Component Architecture
- **Page Structure**: `app/[lang]/page.tsx` serves as main entry point
- **UI Components**: Modular components in `app/[lang]/ui/` (Nav, Content, etc.)
- **Reusable Components**: Shared components in `app/[lang]/ui/components/`

### Environment Configuration
- Uses Azure Speech Services with region-based endpoints
- Configurable input length limit (default 4000 characters)
- Security headers implemented in middleware (X-Frame-Options, CSP)

### Development Tools
- **Linting**: ESLint with TypeScript, Prettier, and import plugins
- **Git Hooks**: Husky with lint-staged for pre-commit linting
- **Commit Convention**: Conventional commits enforced by commitlint

### Key Files for Understanding
- `app/lib/constants.ts` - Azure endpoints and configuration constants
- `app/lib/types.ts` - TypeScript type definitions
- `middleware.ts` - Request routing and security headers
- `app/api/audio/route.ts` - Core TTS functionality