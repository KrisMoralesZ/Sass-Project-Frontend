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

export interface IAppThemeProvider {
  children: ReactNode
  /** Initial preference; defaults to `system`. Profile UI can call `setPreference` later. */
  initialPreference?: ThemeModePreference
}

const AppThemeProvider: FC<IAppThemeProvider> = ({
  children,
  initialPreference = 'system',
}) => {
  const [preference, setPreference] =
    useState<ThemeModePreference>(initialPreference)
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
    setPreference(next)
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
