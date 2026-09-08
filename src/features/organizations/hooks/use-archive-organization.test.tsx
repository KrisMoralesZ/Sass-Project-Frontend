import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { organizationQueryKey } from '../api/get-organization'
import { tenantContextQueryKey } from '../api/get-tenant-context'
import { archiveOrganization } from '../api/archive-organization'
import { organizationsQueryOptions } from '../api/list-organizations'
import type { ListOrganizationsResponse } from '../api/organization-api.types'
import { setActiveOrganizationId } from '../active-organization-storage'
import { useArchiveOrganization } from './use-archive-organization'

vi.mock('../api/archive-organization', () => ({
  archiveOrganization: vi.fn(),
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

const list: ListOrganizationsResponse = {
  items: [organization('org-a'), organization('org-b')],
  pagination: {
    page: 1,
    limit: 20,
    total: 2,
    totalPages: 1,
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

describe('useArchiveOrganization', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(archiveOrganization).mockReset()
    vi.mocked(archiveOrganization).mockResolvedValue(undefined)
  })

  it('removes the archived workspace from the list and reassigns the active org', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(organizationsQueryOptions().queryKey, list)
    queryClient.setQueryData(
      organizationQueryKey('org-a'),
      organization('org-a'),
    )
    queryClient.setQueryData(tenantContextQueryKey('org-a'), {
      organizationId: 'org-a',
    })
    setActiveOrganizationId('org-a')

    const { result } = renderHook(() => useArchiveOrganization('org-a'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const nextList = queryClient.getQueryData<ListOrganizationsResponse>(
      organizationsQueryOptions().queryKey,
    )
    expect(nextList?.items.map((item) => item.id)).toEqual(['org-b'])
    expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBe(
      'org-b',
    )
    expect(
      queryClient.getQueryData(organizationQueryKey('org-a')),
    ).toBeUndefined()
  })

  it('clears the active organization when the archived id was selected without a list cache', async () => {
    setActiveOrganizationId('org-a')
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(() => useArchiveOrganization('org-a'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBeNull()
  })
})
