import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { tenantContextQueryOptions } from '../api/get-tenant-context'
import { useTenantContext } from './use-tenant-context'

vi.mock('../api/get-tenant-context', () => ({
  tenantContextQueryKey: vi.fn((organizationId: string) => [
    'tenant',
    'context',
    organizationId,
  ]),
  tenantContextQueryOptions: vi.fn((organizationId: string) => ({
    queryKey: ['tenant', 'context', organizationId],
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

describe('useTenantContext', () => {
  it('builds tenant context query options for the active organization', () => {
    renderHook(() => useTenantContext('org-1'), { wrapper })

    expect(tenantContextQueryOptions).toHaveBeenCalledWith('org-1')
  })

  it('stays idle without an organization id', () => {
    const { result } = renderHook(() => useTenantContext(null), { wrapper })

    expect(tenantContextQueryOptions).toHaveBeenCalledWith('')
    expect(result.current.fetchStatus).toBe('idle')
  })
})
