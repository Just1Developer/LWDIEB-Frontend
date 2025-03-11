import { DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { AvailableThemes, Theme, User, UserData } from '@/lib/types'

export interface BackendUser {
  name: string
  id: string
  email: string
  admin: boolean
  language: string
  theme: string
  selectedTheme: AvailableThemes
}

export interface UserThemes {
  lightTheme: Theme
  darkTheme: Theme
}

export const FALLBACK_USER: User = {
  name: '?',
  id: DEFAULT_USER_UUID,
  email: `?`,
  admin: false,
  language: 'en-US',
}

export const DEFAULT_LIGHT_THEME: Theme = {
  backgroundBoard: '#F2F3F5',
  backgroundWidget: '#FFFFFF',
  backgroundButton: '#1d1d23',
  foregroundButton: '#f3f3f3',
  foregroundText: '#2E3338',
  foregroundOther: '#4F5660',
  accent: '#448f79',
  accentForeground: '#FFFFFF',
}

export const DEFAULT_DARK_THEME: Theme = {
  backgroundBoard: '#0B0C0E',
  backgroundWidget: '#131517',
  backgroundButton: '#2A2D32',
  foregroundButton: '#E3E5E8',
  foregroundText: '#DCDDDE',
  foregroundOther: '#72767D',
  accent: '#00897B',
  accentForeground: '#FFFFFF',
}

export const DEFAULT_THEMES = JSON.stringify({
  lightTheme: DEFAULT_LIGHT_THEME,
  darkTheme: DEFAULT_DARK_THEME,
})

// Copy of Theme, but everything is optional
interface ThemeOptional {
  // Hex
  backgroundBoard?: string
  backgroundWidget?: string
  backgroundButton?: string
  foregroundButton?: string
  foregroundText?: string
  foregroundOther?: string
  accent?: string
  accentForeground?: string
}

export const DEFAULT_USER_DATA: UserData = {
  user: undefined,
  selectedTheme: 'light',
  darkTheme: DEFAULT_DARK_THEME,
  lightTheme: DEFAULT_LIGHT_THEME,
}

export const toUser = ({ dataUser }: { dataUser: BackendUser }): UserData => {
  const user: User = {
    id: dataUser.id,
    name: dataUser.name,
    email: dataUser.email,
    admin: dataUser.admin,
    language: dataUser.language,
  }

  let dataThemes: {
    lightTheme: ThemeOptional
    darkTheme: ThemeOptional
  }
  try {
    const parsed = JSON.parse(dataUser.theme)
    dataThemes = {
      lightTheme: parsed.lightTheme ?? DEFAULT_LIGHT_THEME,
      darkTheme: parsed.darkTheme ?? DEFAULT_DARK_THEME,
    }
  } catch (_) {
    dataThemes = {
      lightTheme: DEFAULT_LIGHT_THEME,
      darkTheme: DEFAULT_DARK_THEME,
    }
  }

  const { selectedTheme } = dataUser
  return {
    user,
    selectedTheme,
    darkTheme: parseTheme({ parsed: dataThemes.darkTheme, fallback: DEFAULT_DARK_THEME }),
    lightTheme: parseTheme({ parsed: dataThemes.lightTheme, fallback: DEFAULT_LIGHT_THEME }),
  }
}

const parseTheme = ({ parsed, fallback }: { parsed: ThemeOptional; fallback: Theme }) => ({
  backgroundBoard: parsed.backgroundBoard ?? fallback.backgroundBoard,
  backgroundWidget: parsed.backgroundWidget ?? fallback.backgroundWidget,
  backgroundButton: parsed.backgroundButton ?? fallback.backgroundButton,
  foregroundButton: parsed.foregroundButton ?? fallback.foregroundButton,
  foregroundText: parsed.foregroundText ?? fallback.foregroundText,
  foregroundOther: parsed.foregroundOther ?? fallback.foregroundOther,
  accent: parsed.accent ?? fallback.accent,
  accentForeground: parsed.accentForeground ?? fallback.accentForeground,
})
