import { type FC, useEffect } from 'react'
import { useThemePreference } from '@/styles/useThemePreference'
import { useMyProfile } from './hooks/use-my-profile'

/**
 * Apply the saved profile theme app-wide (not only on `/profile`).
 * `AppThemeProvider` hydrates from sessionStorage first; this overwrites with
 * the profile value once `GET /users/me` resolves.
 */
const ThemePreferenceSync: FC = () => {
  const { setPreference } = useThemePreference()
  const profileQuery = useMyProfile()
  const savedTheme = profileQuery.data?.preferences.theme

  useEffect(() => {
    if (!savedTheme) {
      return
    }

    setPreference(savedTheme)
  }, [savedTheme, setPreference])

  return null
}

export default ThemePreferenceSync
