import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateMemberRole } from '../api/update-member-role'
import { OrganizationRole } from '../permissions/organization-role'
import { useUpdateMemberRole } from './use-update-member-role'

vi.mock('../api/update-member-role', () => ({
  updateMemberRole: vi.fn(),
}))

const updatedMember = {
  id: 'member-1',
  organizationId: 'org-1',
  userId: 'user-1',
  role: OrganizationRole.ADMIN,
  email: 'member@company.com',
  displayName: 'Member',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useUpdateMemberRole', () => {
  beforeEach(() => {
    vi.mocked(updateMemberRole).mockReset()
    vi.mocked(updateMemberRole).mockResolvedValue(updatedMember)
  })

  it('updates the member role and invalidates the org members cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(
      () => useUpdateMemberRole('org-1', 'user-1'),
      { wrapper: createWrapper(queryClient) },
    )

    result.current.mutate(OrganizationRole.ADMIN)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(vi.mocked(updateMemberRole).mock.calls[0]).toEqual([
      'user-1',
      OrganizationRole.ADMIN,
    ])
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['members', 'org-1'],
    })
  })

  it('skips invalidation without an active organization', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateMemberRole('', 'user-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate(OrganizationRole.ADMIN)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
