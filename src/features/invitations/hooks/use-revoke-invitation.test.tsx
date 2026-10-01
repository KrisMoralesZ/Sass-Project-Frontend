import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { invitationsQueryKey } from '../api/list-invitations'
import { revokeInvitation } from '../api/revoke-invitation'
import { useRevokeInvitation } from './use-revoke-invitation'

vi.mock('../api/revoke-invitation', () => ({
  revokeInvitation: vi.fn(),
}))

const revoked = {
  id: 'invite-1',
  organizationId: 'org-1',
  email: 'jane@example.com',
  role: OrganizationRole.MEMBER,
  status: 'revoked' as const,
  invitedByUserId: 'user-1',
  expiresAt: '2026-01-22T00:00:00.000Z',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
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
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

describe('useRevokeInvitation', () => {
  beforeEach(() => {
    vi.mocked(revokeInvitation).mockReset()
    vi.mocked(revokeInvitation).mockResolvedValue(revoked)
  })

  it('revokes the invitation and invalidates the org invite list', async () => {
    const queryClient = createClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useRevokeInvitation('org-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate('invite-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(vi.mocked(revokeInvitation).mock.calls[0][0]).toBe('invite-1')
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: invitationsQueryKey('org-1') }),
    )
  })

  it('skips invalidation without an active organization', async () => {
    const queryClient = createClient()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useRevokeInvitation(''), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate('invite-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})