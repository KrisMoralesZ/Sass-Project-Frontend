import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import { useThemePreference } from '@/styles/useThemePreference'
import { useMyProfile } from './hooks/use-my-profile'
import ThemePreferenceSync from './ThemePreferenceSync'
import type { UserProfile } from './api/user-api.types'

vi.mock('./hooks/use-my-profile', () => ({
  useMyProfile: vi.fn(),
}))

const profile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  email: 'owner@acme.local',
  displayName: 'Jane Owner',
  avatarUrl: null,
  preferences: {
    timezone: 'UTC',
    locale: 'en',
    theme: 'dark',
    notifications: { email: true, inApp: true, marketing: false },
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function ThemeProbe() {
  const { preference } = useThemePreference()
  return <p data-testid="preference">{preference}</p>
}

describe('ThemePreferenceSync', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(useMyProfile).mockReturnValue({
      data: profile,
      isPending: false,
      isError: false,
    } as ReturnType<typeof useMyProfile>)
  })

  afterEach(() => {
    cleanup()
  })

  it('applies the saved profile theme to the app provider', () => {
    render(
      <AppThemeProvider initialPreference="light">
        <ThemePreferenceSync />
        <ThemeProbe />
      </AppThemeProvider>,
    )

    expect(screen.getByTestId('preference').textContent).toBe('dark')
  })
})
