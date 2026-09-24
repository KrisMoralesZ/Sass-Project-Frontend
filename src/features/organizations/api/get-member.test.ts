import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import {
  getOrganizationMember,
  organizationMemberQueryKey,
  organizationMemberQueryOptions,
} from './get-member'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('getOrganizationMember', () => {
  it('fetches a member by user id', async () => {
    const member = {
      id: 'member-1',
      organizationId: 'org-1',
      userId: 'user-1',
      role: 'OWNER',
      email: 'owner@company.com',
      displayName: 'Owner',
      avatarUrl: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(apiClient.get).mockResolvedValue(member)

    await expect(getOrganizationMember('user-1')).resolves.toEqual(member)
    expect(apiClient.get).toHaveBeenCalledWith('/members/user-1')
  })
})

describe('organizationMemberQueryOptions', () => {
  it('builds a scoped query key and stays disabled without ids', () => {
    expect(organizationMemberQueryKey('org-1', 'user-1')).toEqual([
      'members',
      'org-1',
      'user-1',
    ])

    const options = organizationMemberQueryOptions('', 'user-1')
    expect(options.enabled).toBe(false)
  })
})
