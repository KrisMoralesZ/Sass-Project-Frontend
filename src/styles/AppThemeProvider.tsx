import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './GlobalStyle'
import {
  readSystemPrefersDark,
  resolveThemeMode,
  type ThemeModePreference,
} from './theme-mode'
import { ThemePreferenceContext } from './theme-preference-context'
import { getAppTheme } from './theme'
import {
  getStoredThemePreference,
  setStoredThemePreference,
} from './theme-preference-storage'

export interface IAppThemeProvider {
  children: ReactNode
  /**
   * Explicit starting preference (tests / Storybook). When omitted, the last
   * stored preference is restored, then `system`.
   */
  initialPreference?: ThemeModePreference
}

const AppThemeProvider: FC<IAppThemeProvider> = ({
  children,
  initialPreference,
}) => {
  const [preference, setPreferenceState] = useState<ThemeModePreference>(
    () => initialPreference ?? getStoredThemePreference() ?? 'system',
  )
  const [prefersDark, setPrefersDark] = useState(readSystemPrefersDark)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches)
    }

    setPrefersDark(media.matches)
    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  const resolvedMode = resolveThemeMode(preference, prefersDark)
  const theme = getAppTheme(resolvedMode)

  const setPreferenceStable = useCallback((next: ThemeModePreference) => {
    setStoredThemePreference(next)
    setPreferenceState(next)
  }, [])

  const preferenceValue = useMemo(
    () => ({
      preference,
      resolvedMode,
      setPreference: setPreferenceStable,
    }),
    [preference, resolvedMode, setPreferenceStable],
  )

  return (
    <ThemePreferenceContext.Provider value={preferenceValue}>
      <ThemeProvider theme={theme}>
        <GlobalStyle $colorScheme={resolvedMode} />
        {children}
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export default AppThemeProvider
