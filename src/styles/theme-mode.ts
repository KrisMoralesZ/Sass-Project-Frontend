/** Saved preference shape (mirrors backend `UserProfileTheme`). */
export type ThemeModePreference = 'system' | 'light' | 'dark'

export type ResolvedThemeMode = 'light' | 'dark'

export const THEME_MODE_PREFERENCES = [
  'system',
  'light',
  'dark',
] as const satisfies readonly ThemeModePreference[]

/** Map a saved preference + OS setting to the active styled-components mode. */
export function resolveThemeMode(
  preference: ThemeModePreference,
  prefersDark: boolean,
): ResolvedThemeMode {
  if (preference === 'dark') {
    return 'dark'
  }

  if (preference === 'light') {
    return 'light'
  }

  return prefersDark ? 'dark' : 'light'
}

export function readSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
