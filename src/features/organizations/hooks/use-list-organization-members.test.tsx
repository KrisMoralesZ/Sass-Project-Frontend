import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { organizationMembersQueryOptions } from '../api/list-members'
import { useListOrganizationMembers } from './use-list-organization-members'

vi.mock('../api/list-members', () => ({
  organizationMembersQueryKey: ['members', 'org-1'],
  organizationMembersQueryOptions: vi.fn(() => ({
    queryKey: ['members', 'org-1', { page: 1 }],
    queryFn: vi.fn(),
    enabled: true,
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

describe('useListOrganizationMembers', () => {
  it('uses the members list query options for the active organization', () => {
    const query = { page: 1, search: 'jane' }

    renderHook(() => useListOrganizationMembers('org-1', query), { wrapper })

    expect(organizationMembersQueryOptions).toHaveBeenCalledWith('org-1', query)
  })
})
