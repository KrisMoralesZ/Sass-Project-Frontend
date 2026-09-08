import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthSessionProvider from '../AuthSessionProvider'
import { register } from '../api/register'
import { useRegisterMutation } from './use-register-mutation'

vi.mock('../api/register', () => ({
  register: vi.fn(),
}))

vi.mock('../api/get-current-user', () => ({
  currentUserQueryKey: ['auth', 'me'],
  getCurrentUser: vi.fn(),
  currentUserQueryOptions: () => ({
    queryKey: ['auth', 'me'],
    queryFn: vi.fn(),
  }),
}))

const sessionResponse = {
  user: {
    id: 'user-1',
    email: 'owner@company.com',
    displayName: 'Owner',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  tokens: {
    accessToken: 'access-1',
    refreshToken: 'refresh-1',
    expiresIn: 900,
  },
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  )
}

describe('useRegisterMutation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(register).mockReset()
    vi.mocked(register).mockResolvedValue(sessionResponse)
  })

  it('applies the auth session after a successful registration', async () => {
    const onAuthenticated = vi.fn()
    const { result } = renderHook(
      () => useRegisterMutation({ onAuthenticated }),
      { wrapper },
    )

    result.current.mutate({
      email: 'owner@company.com',
      password: 'Password1',
      displayName: 'Owner',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(register).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
      displayName: 'Owner',
    })
    expect(onAuthenticated).toHaveBeenCalledOnce()
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBe('access-1')
  })
})
