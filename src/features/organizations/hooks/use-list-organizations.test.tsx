import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { organizationsQueryOptions } from '../api/list-organizations'
import { useListOrganizations } from './use-list-organizations'

vi.mock('../api/list-organizations', () => ({
  organizationsQueryKey: ['organizations'],
  organizationsQueryOptions: vi.fn(() => ({
    queryKey: ['organizations'],
    queryFn: vi.fn(),
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

describe('useListOrganizations', () => {
  it('uses the organizations list query options', () => {
    renderHook(() => useListOrganizations(), { wrapper })

    expect(organizationsQueryOptions).toHaveBeenCalled()
  })
})
