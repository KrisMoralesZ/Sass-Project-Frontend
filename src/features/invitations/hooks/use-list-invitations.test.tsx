import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { listInvitations } from '../api/list-invitations'
import { useListInvitations } from './use-list-invitations'

vi.mock('../api/list-invitations', () => {
  const listInvitationsMock = vi.fn()
  return {
    invitationsQueryKey: vi.fn(),
    invitationsQueryOptions: (organizationId: string, query?: unknown) => ({
      queryKey: ['invites', organizationId, query],
      queryFn: () => listInvitationsMock(query),
      enabled: Boolean(organizationId),
    }),
    listInvitations: listInvitationsMock,
  }
})

const response = {
  items: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

function createClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

describe('useListInvitations', () => {
  beforeEach(() => {
    vi.mocked(listInvitations).mockReset()
    vi.mocked(listInvitations).mockResolvedValue(response)
  })

  it('fetches the pending invitations for the active organization', async () => {
    const query = {
      page: 1,
      limit: 20,
      status: 'pending' as const,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
    }
    const queryClient = createClient()

    const { result } = renderHook(() => useListInvitations('org-1', query), {
      wrapper: createWrapper(queryClient),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(vi.mocked(listInvitations).mock.calls[0][0]).toEqual(query)
    expect(result.current.data).toEqual(response)
  })

  it('stays idle without an active organization', () => {
    const queryClient = createClient()

    const { result } = renderHook(() => useListInvitations(null), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.isPending).toBe(true)
    expect(listInvitations).not.toHaveBeenCalled()
  })
})