import { useContext } from 'react'
import { ThemePreferenceContext } from './theme-preference-context'

/** Read or update the app theme preference (`system` | `light` | `dark`). */
export function useThemePreference() {
  const context = useContext(ThemePreferenceContext)

  if (!context) {
    throw new Error('useThemePreference must be used within AppThemeProvider')
  }

  return context
}
