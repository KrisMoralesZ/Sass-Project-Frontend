import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { AuthUserProfile } from '@/features/auth/auth-api.types'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from '@/routes/paths'
import AppThemeProvider from '@/styles/AppThemeProvider'
import ShellUserMenu from '.'

vi.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: vi.fn(),
}))

const baseUser: AuthUserProfile = {
  id: 'user-1',
  email: 'owner@acme.local',
  displayName: 'Jane Owner',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function renderMenu(user: AuthUserProfile | null = baseUser) {
  vi.mocked(useAuthSession).mockReturnValue({
    user,
    status: user ? 'authenticated' : 'anonymous',
    isAuthenticated: Boolean(user),
    establishSession: vi.fn(),
    syncSessionUserDisplayName: vi.fn(),
    clearSession: vi.fn(),
  })

  return render(
    <AppThemeProvider>
      <MemoryRouter>
        <ShellUserMenu />
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

describe('ShellUserMenu', () => {
  it('shows the saved display name and a profile link', () => {
    renderMenu()

    expect(screen.getByRole('navigation', { name: 'Account' })).toBeTruthy()
    expect(screen.getByText('Jane Owner')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Profile' }).getAttribute('href')).toBe(
      paths.profile,
    )
    expect(screen.getByText('owner@acme.local')).toBeTruthy()
  })

  it('falls back to email when display name is empty', () => {
    renderMenu({ ...baseUser, displayName: null })

    expect(screen.getByText('owner@acme.local')).toBeTruthy()
    expect(screen.queryByText('Jane Owner')).toBeNull()
  })

  it('reflects an updated display name from the auth session', () => {
    const { rerender } = renderMenu()

    expect(screen.getByText('Jane Owner')).toBeTruthy()

    vi.mocked(useAuthSession).mockReturnValue({
      user: { ...baseUser, displayName: 'Updated Name' },
      status: 'authenticated',
      isAuthenticated: true,
      establishSession: vi.fn(),
      syncSessionUserDisplayName: vi.fn(),
      clearSession: vi.fn(),
    })

    rerender(
      <AppThemeProvider>
        <MemoryRouter>
          <ShellUserMenu />
        </MemoryRouter>
      </AppThemeProvider>,
    )

    expect(screen.getByText('Updated Name')).toBeTruthy()
    expect(screen.queryByText('Jane Owner')).toBeNull()
  })

  it('renders nothing when the auth user is unavailable', () => {
    renderMenu(null)

    expect(screen.queryByRole('navigation', { name: 'Account' })).toBeNull()
  })
})
