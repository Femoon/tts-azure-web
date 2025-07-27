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
- **Next.js 15** with App Router and TypeScript
- **React 19**: Latest React version with enhanced performance
- **State Management**: Zustand with persistence middleware for global state
- **Internationalization**: Built-in i18n with `[lang]` dynamic routes supporting English (`en`) and Chinese (`cn`)
- **UI Framework**: NextUI with Tailwind CSS and Framer Motion animations
- **Azure Integration**: Uses Microsoft Cognitive Services Speech SDK for TTS functionality

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
- **Linting**: ESLint v9 with TypeScript, Prettier, and import plugins
- **State Management**: Zustand v5 with persistence middleware
- **Git Hooks**: Husky with lint-staged for pre-commit linting
- **Commit Convention**: Conventional commits enforced by commitlint

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