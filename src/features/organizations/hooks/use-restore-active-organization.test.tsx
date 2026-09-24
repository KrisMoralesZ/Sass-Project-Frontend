import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getActiveOrganizationId,
  setActiveOrganizationId,
} from '../active-organization-storage'
import { useListOrganizations } from './use-list-organizations'
import { useRestoreActiveOrganization } from './use-restore-active-organization'

vi.mock('./use-list-organizations', () => ({
  useListOrganizations: vi.fn(),
}))

const organization = (id: string) => ({
  id,
  name: id,
  slug: id,
  plan: 'FREE' as const,
  settings: {
    timezone: 'UTC',
    locale: 'en',
    branding: {
      logoUrl: null,
      primaryColor: null,
      accentColor: null,
      appName: null,
    },
    featureFlags: {
      betaBoards: false,
      advancedReports: false,
      memberInvites: false,
      customBranding: false,
    },
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

const listResponse = (ids: string[]) => ({
  items: ids.map(organization),
  pagination: {
    page: 1,
    limit: 20,
    total: ids.length,
    totalPages: ids.length === 0 ? 0 : 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
})

describe('useRestoreActiveOrganization', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(useListOrganizations).mockReset()
  })

  it('clears the active organization when the user has no workspaces', async () => {
    setActiveOrganizationId('org-stale')
    vi.mocked(useListOrganizations).mockReturnValue({
      isLoading: false,
      isPending: false,
      isError: false,
      data: listResponse([]),
    } as unknown as ReturnType<typeof useListOrganizations>)

    const { result } = renderHook(() => useRestoreActiveOrganization())

    await waitFor(() => {
      expect(result.current.isRestored).toBe(true)
    })
    expect(getActiveOrganizationId()).toBeNull()
  })

  it('keeps a stored organization id when it is still available', async () => {
    setActiveOrganizationId('org-b')
    vi.mocked(useListOrganizations).mockReturnValue({
      isLoading: false,
      isPending: false,
      isError: false,
      data: listResponse(['org-a', 'org-b']),
    } as unknown as ReturnType<typeof useListOrganizations>)

    const { result } = renderHook(() => useRestoreActiveOrganization())

    await waitFor(() => {
      expect(result.current.isRestored).toBe(true)
    })
    expect(getActiveOrganizationId()).toBe('org-b')
  })

  it('falls back to the first workspace when the stored id is unavailable', async () => {
    setActiveOrganizationId('org-archived')
    vi.mocked(useListOrganizations).mockReturnValue({
      isLoading: false,
      isPending: false,
      isError: false,
      data: listResponse(['org-a', 'org-b']),
    } as unknown as ReturnType<typeof useListOrganizations>)

    const { result } = renderHook(() => useRestoreActiveOrganization())

    await waitFor(() => {
      expect(result.current.isRestored).toBe(true)
    })
    expect(getActiveOrganizationId()).toBe('org-a')
  })

  it('waits while the organization list is loading without changing storage', () => {
    setActiveOrganizationId('org-a')
    vi.mocked(useListOrganizations).mockReturnValue({
      isLoading: true,
      isPending: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useListOrganizations>)

    const { result } = renderHook(() => useRestoreActiveOrganization())

    expect(result.current.isRestored).toBe(true)
    expect(getActiveOrganizationId()).toBe('org-a')
  })
})
