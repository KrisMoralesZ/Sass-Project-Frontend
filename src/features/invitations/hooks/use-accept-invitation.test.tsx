import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { acceptInvitation } from '../api/accept-invitation'
import type { AcceptInvitationResponse } from '../api/invitation-api.types'
import { useAcceptInvitation } from './use-accept-invitation'

vi.mock('../api/accept-invitation', () => ({
  acceptInvitation: vi.fn(),
}))

const acceptedResponse: AcceptInvitationResponse = {
  invitation: {
    id: 'invite-1',
    organizationId: 'org-1',
    email: 'invitee@acme.local',
    role: OrganizationRole.MEMBER,
    status: 'accepted',
    invitedByUserId: 'owner-1',
    expiresAt: '2026-01-22T00:00:00.000Z',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  membership: {
    id: 'membership-1',
    organizationId: 'org-1',
    userId: 'user-1',
    role: OrganizationRole.MEMBER,
    email: 'invitee@acme.local',
    displayName: null,
    avatarUrl: null,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useAcceptInvitation', () => {
  beforeEach(() => {
    vi.mocked(acceptInvitation).mockReset()
    vi.mocked(acceptInvitation).mockResolvedValue(acceptedResponse)
  })

  it('accepts an invitation by token and reports the resulting membership', async () => {
    const { result } = renderHook(() => useAcceptInvitation(), { wrapper })

    result.current.mutate({ token: 'seed-token-0001' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(acceptInvitation).toHaveBeenCalledWith(
      { token: 'seed-token-0001' },
      expect.anything(),
    )
    expect(result.current.data).toEqual(acceptedResponse)
  })

  it('runs the onAccepted callback with the accept response', async () => {
    const onAccepted = vi.fn()
    const { result } = renderHook(() => useAcceptInvitation({ onAccepted }), {
      wrapper,
    })

    result.current.mutate({ token: 'seed-token-0001' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(onAccepted).toHaveBeenCalledWith(acceptedResponse)
  })
})
