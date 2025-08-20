# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development
- `yarn dev` - Start development server
- `yarn lan-dev` - Start development server accessible on LAN (binds to 0.0.0.0)
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Lint and fix TypeScript/JavaScript files with ESLint (max 0 warnings)

### Docker Deployment
Build and run with Docker:
```bash
docker build -t tts-azure-web .
docker run -p 3000:3000 -e SPEECH_KEY=your_key -e SPEECH_REGION=your_region tts-azure-web
```

### TypeScript Checking
No dedicated TypeScript check script - type checking happens during build process with `yarn build`

### Environment Setup
Before development, create `.env.local` with:
```bash
# Required: Azure Cognitive Services credentials
SPEECH_KEY=your_azure_key
SPEECH_REGION=your_azure_region

# Optional: Application configuration
NEXT_PUBLIC_MAX_INPUT_LENGTH=4000  # Maximum text input length (default: 4000)

# Optional: Next.js configuration
NEXT_TELEMETRY_DISABLED=1         # Disable Next.js telemetry (uncomment in Dockerfile if needed)
```

Common Azure regions: `eastus`, `westus2`, `eastasia`, `westeurope`, etc.

## Architecture Overview

### Framework & Structure
- **Next.js 15** with App Router and TypeScript
- **React 19**: Latest React version with enhanced performance
- **State Management**: Zustand with persistence middleware for global state
- **Internationalization**: Built-in i18n with `[lang]` dynamic routes supporting English (`en`) and Chinese (`cn`)
- **UI Framework**: HeroUI (NextUI v2) with Tailwind CSS v4 and Framer Motion animations
- **Azure Integration**: Uses Microsoft Cognitive Services Speech SDK for TTS functionality
- **Testing**: No test framework is currently configured

### Key Architectural Patterns

#### State Management with Zustand
- **TTS Store** (`app/lib/stores/tts-store.ts`): Manages TTS configuration, input text, and UI state
  - Config: Voice settings, language, style, volume, pitch, etc.
  - Input: Text content with automatic persistence
  - UI State: Loading and playing states
  - Actions: Type-safe config updates and state mutations
- **Theme Store** (`app/lib/stores/theme-store.ts`): Handles theme switching and persistence
  - System theme detection with fallback
  - localStorage persistence with automatic DOM updates
  - OverlayScrollbars theme synchronization
- **Persistence**: Automatic localStorage sync for user preferences and settings

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

#### Dual Mode System
The application supports two distinct operating modes:

- **Normal Mode**: Uses UI controls to configure TTS parameters (voice, speed, pitch, etc.), automatically generates SSML from configuration
- **SSML Mode**: Allows direct input of Speech Synthesis Markup Language for fine-grained control
- **Mode Switching**: `useTTSStore.toggleSSMLMode()` automatically caches current state when switching modes
- **State Persistence**: Both modes maintain separate cached states in localStorage via Zustand persistence

#### Component Architecture
- **Page Structure**: `app/[lang]/page.tsx` serves as main entry point
- **UI Components**: Modular components in `app/[lang]/ui/` (Nav, Content, etc.)
- **Reusable Components**: Shared components in `app/[lang]/ui/components/`
- **State Integration**: Components use Zustand stores via hooks for global state
- **Local State**: UI-specific state (modals, dropdowns) managed with useState

### Environment Configuration
- Uses Azure Speech Services with region-based endpoints
- Configurable input length limit (default 4000 characters)
- Security headers implemented in middleware (X-Frame-Options, CSP)

### Development Tools
- **Linting**: ESLint v9 with TypeScript, Prettier, and import plugins with import ordering rules
- **State Management**: Zustand v5 with persistence middleware
- **Git Hooks**: Husky v8 with lint-staged for pre-commit automation
  - Pre-commit: Runs `yarn lint` and `prettier --write` on staged TypeScript/JavaScript files
  - Commit message: Conventional commits enforced by commitlint
- **Package Management**: Yarn with lockfile validation in Docker builds

### Key Files for Understanding
- `app/lib/stores/` - Zustand state management stores
  - `tts-store.ts` - TTS configuration and UI state
  - `theme-store.ts` - Theme management with persistence
  - `index.ts` - Store exports and type definitions
- `app/lib/constants.ts` - Azure endpoints and configuration constants
- `app/lib/types.ts` - TypeScript type definitions
- `app/lib/hooks/use-theme.ts` - Theme hook using Zustand store
- `middleware.ts` - Request routing and security headers
- `app/api/audio/route.ts` - Core TTS functionality

## API Structure

### API Endpoints
- `POST /api/audio` - Generate TTS audio from text or SSML
  - Accepts: `{ input: string, config?: Config, isSSMLMode?: boolean }`
  - Returns: `{ base64Audio: string }` or error response
  - Validates input length against `MAX_INPUT_LENGTH`
  - Handles both normal mode (with config) and SSML mode (raw SSML input)

### Azure Integration
- `app/api/token/fetch-token.ts` - Fetches Azure authentication tokens
- `app/api/list/fetch-list.ts` - Retrieves available voice models from Azure
- Uses Azure endpoints from `app/lib/constants.ts` with region-based URLs
- Authentication via `SPEECH_KEY` environment variable

## State Management Guide

### Zustand Store Usage

#### TTS Store (`useTTSStore`)
```typescript
import { useTTSStore } from '@/app/lib/stores'

// Access state and actions
const {
  config,           // TTS configuration object
  input,            // Text input content
  isLoading,        // Loading state
  isPlaying,        // Audio playing state
  setConfig,        // Update entire config
  updateConfigField,// Update single config field
  setInput,         // Update input text
  setIsLoading,     // Update loading state
  setIsPlaying,     // Update playing state
} = useTTSStore()

// Example usage
updateConfigField('voiceName', 'newVoice')
setConfig({ lang: 'en-US', gender: 'male' })
```

#### Theme Store (`useThemeStore`)
```typescript
import { useThemeStore } from '@/app/lib/stores'

// Direct store access
const { theme, setTheme, toggleTheme, initializeTheme } = useThemeStore()

// Or use the convenience hook
import useTheme from '@/app/lib/hooks/use-theme'
const [theme, setTheme] = useTheme()
```

### State Persistence
- **TTS Store**: Config and input text automatically saved to localStorage
- **Theme Store**: Theme preference persists across sessions
- **System Integration**: Theme store detects system preference changes
- **Hydration Safe**: SSR-compatible with proper initialization