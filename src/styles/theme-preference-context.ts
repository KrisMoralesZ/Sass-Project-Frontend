import { createContext } from 'react'
import type { ResolvedThemeMode, ThemeModePreference } from './theme-mode'

export interface ThemePreferenceContextValue {
  /** Saved preference (`system` follows the OS light/dark setting). */
  preference: ThemeModePreference
  /** Resolved mode used by `ThemeProvider`. */
  resolvedMode: ResolvedThemeMode
  setPreference: (preference: ThemeModePreference) => void
}

export const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null)
