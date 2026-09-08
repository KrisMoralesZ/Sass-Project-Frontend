import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AuthSessionProvider from './AuthSessionProvider'
import { useAuthSession } from './useAuthSession'
import { getCurrentUser } from './api/get-current-user'
import { notifySessionCleared } from './session-events'

vi.mock('./api/get-current-user', () => {
  const fetchCurrentUser = vi.fn()
  return {
    currentUserQueryKey: ['auth', 'me'],
    getCurrentUser: fetchCurrentUser,
    currentUserQueryOptions: () => ({
      queryKey: ['auth', 'me'],
      queryFn: fetchCurrentUser,
    }),
  }
})

const profile = {
  id: 'user-1',
  email: 'owner@company.com',
  displayName: 'Owner',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function Probe() {
  const session = useAuthSession()
  return (
    <div>
      <span data-testid="status">{session.status}</span>
      <span data-testid="email">{session.user?.email ?? ''}</span>
      <button type="button" onClick={() => session.clearSession()}>
        Sign out
      </button>
      <button
        type="button"
        onClick={() =>
          session.establishSession(
            { accessToken: 'a', refreshToken: 'r' },
            profile,
          )
        }
      >
        Sign in
      </button>
    </div>
  )
}

function renderSession(ui: ReactNode = <Probe />) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{ui}</AuthSessionProvider>
    </QueryClientProvider>,
  )
}

describe('AuthSessionProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(getCurrentUser).mockReset()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('starts anonymous when no tokens are stored', () => {
    renderSession()

    expect(screen.getByTestId('status').textContent).toBe('anonymous')
    expect(getCurrentUser).not.toHaveBeenCalled()
  })

  it('hydrates the profile when tokens exist', async () => {
    sessionStorage.setItem('sass.auth.accessToken', 'access-1')
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(getCurrentUser).mockResolvedValue(profile)

    renderSession()

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })
    expect(screen.getByTestId('email').textContent).toBe(profile.email)
  })

  it('clears tokens when hydrate fails', async () => {
    sessionStorage.setItem('sass.auth.accessToken', 'access-1')
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('unauthorized'))

    renderSession()

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('anonymous')
    })
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBeNull()
  })

  it('establishSession persists tokens and marks authenticated', async () => {
    renderSession()

    screen.getByRole('button', { name: 'Sign in' }).click()

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBe('a')
    expect(screen.getByTestId('email').textContent).toBe(profile.email)
  })

  it('clearSession and session-cleared events return to anonymous', async () => {
    renderSession()
    screen.getByRole('button', { name: 'Sign in' }).click()

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })

    screen.getByRole('button', { name: 'Sign out' }).click()

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('anonymous')
    })
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBeNull()

    screen.getByRole('button', { name: 'Sign in' }).click()
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated')
    })

    notifySessionCleared('expired')
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('anonymous')
    })
  })
})
