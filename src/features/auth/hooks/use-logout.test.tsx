import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { paths } from '@/routes/paths'
import AuthSessionProvider from '../AuthSessionProvider'
import { useLogout } from './use-logout'
import { logout as logoutApi } from '../api/logout'

vi.mock('../api/logout', () => ({
  logout: vi.fn(),
}))

const navigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useLogout', () => {
  beforeEach(() => {
    navigate.mockReset()
    vi.mocked(logoutApi).mockReset()
    vi.mocked(logoutApi).mockResolvedValue(undefined)
  })

  it('signs out and navigates to login', async () => {
    const { result } = renderHook(() => useLogout(), { wrapper })

    await result.current.signOut()

    expect(logoutApi).toHaveBeenCalledOnce()
    expect(navigate).toHaveBeenCalledWith(paths.login, { replace: true })
    expect(result.current.isLoggingOut).toBe(false)
  })

  it('ignores duplicate sign-out clicks while a request is in flight', async () => {
    let resolveLogout: (() => void) | undefined
    vi.mocked(logoutApi).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve
        }),
    )

    const { result } = renderHook(() => useLogout(), { wrapper })

    void result.current.signOut()
    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(true)
    })

    void result.current.signOut()
    expect(logoutApi).toHaveBeenCalledTimes(1)

    resolveLogout?.()
    await waitFor(() => {
      expect(result.current.isLoggingOut).toBe(false)
    })
  })
})
