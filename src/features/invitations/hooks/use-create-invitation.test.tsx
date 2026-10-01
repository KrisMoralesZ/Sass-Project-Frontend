import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { createInvitation } from '../api/create-invitation'
import { invitationsQueryKey } from '../api/list-invitations'
import { useCreateInvitation } from './use-create-invitation'

vi.mock('../api/create-invitation', () => ({
  createInvitation: vi.fn(),
}))

const invitation = {
  id: 'invite-1',
  organizationId: 'org-1',
  email: 'jane@example.com',
  role: OrganizationRole.MEMBER,
  status: 'pending' as const,
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

describe('useCreateInvitation', () => {
  beforeEach(() => {
    vi.mocked(createInvitation).mockReset()
    vi.mocked(createInvitation).mockResolvedValue(invitation)
  })

  it('creates the invitation and invalidates the org invite list', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateInvitation('org-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      email: 'jane@example.com',
      role: OrganizationRole.MEMBER,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(vi.mocked(createInvitation).mock.calls[0][0]).toEqual({
      email: 'jane@example.com',
      role: OrganizationRole.MEMBER,
    })
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: invitationsQueryKey('org-1') }),
    )
  })

  it('skips invalidation without an active organization', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateInvitation(''), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({
      email: 'jane@example.com',
      role: OrganizationRole.MEMBER,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
