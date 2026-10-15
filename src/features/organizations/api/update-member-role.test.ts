import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { OrganizationRole } from '../permissions/organization-role'
import { updateMemberRole } from './update-member-role'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    patch: vi.fn(),
  },
}))

describe('updateMemberRole', () => {
  it('patches the member role and returns the updated member', async () => {
    const member = {
      id: 'member-1',
      organizationId: 'org-1',
      userId: 'user-1',
      role: OrganizationRole.ADMIN,
      email: 'member@company.com',
      displayName: 'Member',
      avatarUrl: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(apiClient.patch).mockResolvedValue(member)

    await expect(
      updateMemberRole('user-1', OrganizationRole.ADMIN),
    ).resolves.toEqual(member)
    expect(apiClient.patch).toHaveBeenCalledWith('/members/user-1', {
      role: OrganizationRole.ADMIN,
    })
  })
})
