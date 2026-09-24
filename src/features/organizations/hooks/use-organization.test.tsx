import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { organizationQueryOptions } from '../api/get-organization'
import { useOrganization } from './use-organization'

vi.mock('../api/get-organization', () => ({
  organizationQueryKey: vi.fn((organizationId: string) => [
    'organizations',
    organizationId,
  ]),
  organizationQueryOptions: vi.fn((organizationId: string) => ({
    queryKey: ['organizations', organizationId],
    queryFn: vi.fn(),
    enabled: organizationId.length > 0,
  })),
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

describe('useOrganization', () => {
  it('loads organization detail when an id is provided', () => {
    renderHook(() => useOrganization('org-1'), { wrapper })

    expect(organizationQueryOptions).toHaveBeenCalledWith('org-1')
  })

  it('stays idle without an organization id', () => {
    const { result } = renderHook(() => useOrganization(null), { wrapper })

    expect(organizationQueryOptions).toHaveBeenCalledWith('')
    expect(result.current.fetchStatus).toBe('idle')
  })
})
