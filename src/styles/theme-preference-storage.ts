import { THEME_MODE_PREFERENCES, type ThemeModePreference } from './theme-mode'

const THEME_PREFERENCE_KEY = 'sass.theme.preference'

function isThemeModePreference(value: string): value is ThemeModePreference {
  return (THEME_MODE_PREFERENCES as readonly string[]).includes(value)
}

function getThemeStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/**
 * Client-side theme preference cache (task 3.1.5).
 * Uses sessionStorage so a hard refresh in the same tab restores the last
 * applied mode before the profile query confirms the saved value.
 */
export function getStoredThemePreference(): ThemeModePreference | null {
  const storage = getThemeStorage()
  const stored = storage?.getItem(THEME_PREFERENCE_KEY)
  if (!stored || !isThemeModePreference(stored)) {
    return null
  }

  return stored
}

export function setStoredThemePreference(
  preference: ThemeModePreference,
): void {
  getThemeStorage()?.setItem(THEME_PREFERENCE_KEY, preference)
}
