import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrganizationPermission } from '../permissions/organization-permission'
import { useCurrentOrganizationMember } from './use-current-organization-member'
import { usePermission } from './use-permission'

vi.mock('./use-current-organization-member', () => ({
  useCurrentOrganizationMember: vi.fn(),
}))

describe('usePermission', () => {
  it('allows permissions granted to the current role', () => {
    vi.mocked(useCurrentOrganizationMember).mockReturnValue({
      data: {
        id: 'member-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'OWNER',
        email: 'owner@company.com',
        displayName: 'Owner',
        avatarUrl: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      isPending: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCurrentOrganizationMember>)

    const { result } = renderHook(() =>
      usePermission(OrganizationPermission.SETTINGS_UPDATE),
    )

    expect(result.current.role).toBe('OWNER')
    expect(result.current.allowed).toBe(true)
    expect(result.current.isPending).toBe(false)
  })

  it('denies permissions when the role is missing or invalid', () => {
    vi.mocked(useCurrentOrganizationMember).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useCurrentOrganizationMember>)

    const { result } = renderHook(() =>
      usePermission(OrganizationPermission.SETTINGS_UPDATE),
    )

    expect(result.current.role).toBeNull()
    expect(result.current.allowed).toBe(false)
    expect(result.current.isPending).toBe(true)
  })
})
