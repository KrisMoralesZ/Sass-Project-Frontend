import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import AuthSessionProvider from './AuthSessionProvider'
import { useAuthSession } from './useAuthSession'

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

describe('useAuthSession', () => {
  it('throws when used outside AuthSessionProvider', () => {
    expect(() => renderHook(() => useAuthSession())).toThrow(
      /must be used within AuthSessionProvider/,
    )
  })

  it('returns the anonymous session state from the provider', () => {
    const { result } = renderHook(() => useAuthSession(), { wrapper })

    expect(result.current.status).toBe('anonymous')
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.establishSession).toBeTypeOf('function')
    expect(result.current.clearSession).toBeTypeOf('function')
  })
})
