import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { useMyProfile } from './use-my-profile'

vi.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: vi.fn(),
}))

vi.mock('../api/get-my-profile', () => ({
  myProfileQueryKey: ['users', 'me'],
  myProfileQueryOptions: () => ({
    queryKey: ['users', 'me'],
    queryFn: vi.fn(),
  }),
}))

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {children}
    </QueryClientProvider>
  )
}

describe('useMyProfile', () => {
  it('keeps the query disabled until the session is authenticated', () => {
    vi.mocked(useAuthSession).mockReturnValue({
      user: null,
      status: 'anonymous',
      isAuthenticated: false,
      establishSession: vi.fn(),
      clearSession: vi.fn(),
      syncSessionUserDisplayName: vi.fn(),
    })

    const { result } = renderHook(() => useMyProfile(), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.status).toBe('pending')
  })
})
