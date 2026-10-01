import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { organizationMemberQueryOptions } from '../api/get-member'
import { useActiveOrganizationId } from './use-active-organization-id'
import { useCurrentOrganizationMember } from './use-current-organization-member'

vi.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: vi.fn(),
}))

vi.mock('./use-active-organization-id', () => ({
  useActiveOrganizationId: vi.fn(),
}))

vi.mock('../api/get-member', () => ({
  organizationMemberQueryKey: vi.fn(
    (organizationId: string, userId: string) => [
      'members',
      organizationId,
      userId,
    ],
  ),
  organizationMemberQueryOptions: vi.fn(
    (organizationId: string, userId: string) => ({
      queryKey: ['members', organizationId, userId],
      queryFn: vi.fn(),
      enabled: organizationId.length > 0 && userId.length > 0,
    }),
  ),
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

describe('useCurrentOrganizationMember', () => {
  it('queries membership for the active workspace and signed-in user', () => {
    vi.mocked(useAuthSession).mockReturnValue({
      user: {
        id: 'user-1',
        email: 'owner@company.com',
        displayName: 'Owner',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      status: 'authenticated',
      isAuthenticated: true,
      establishSession: vi.fn(),
      clearSession: vi.fn(),
      syncSessionUserDisplayName: vi.fn(),
    })
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')

    renderHook(() => useCurrentOrganizationMember(), { wrapper })

    expect(organizationMemberQueryOptions).toHaveBeenCalledWith(
      'org-1',
      'user-1',
    )
  })

  it('stays disabled without an active organization or user id', () => {
    vi.mocked(useAuthSession).mockReturnValue({
      user: null,
      status: 'anonymous',
      isAuthenticated: false,
      establishSession: vi.fn(),
      clearSession: vi.fn(),
      syncSessionUserDisplayName: vi.fn(),
    })
    vi.mocked(useActiveOrganizationId).mockReturnValue(null)

    renderHook(() => useCurrentOrganizationMember(), { wrapper })

    expect(organizationMemberQueryOptions).toHaveBeenCalledWith('', '')
  })
})
