import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { organizationsQueryOptions } from '../api/list-organizations'
import { createOrganization } from '../api/create-organization'
import type { ListOrganizationsResponse, Organization } from '../api/organization-api.types'
import { useCreateOrganization } from './use-create-organization'

vi.mock('../api/create-organization', () => ({
  createOrganization: vi.fn(),
}))

const organization: Organization = {
  id: 'org-new',
  name: 'New Workspace',
  slug: 'new-workspace',
  plan: 'FREE',
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
}

const existingList: ListOrganizationsResponse = {
  items: [
    {
      ...organization,
      id: 'org-existing',
      name: 'Existing',
      slug: 'existing',
    },
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
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

describe('useCreateOrganization', () => {
  beforeEach(() => {
    vi.mocked(createOrganization).mockReset()
    vi.mocked(createOrganization).mockResolvedValue(organization)
  })

  it('prepends the created workspace to the cached list on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(organizationsQueryOptions().queryKey, existingList)

    const { result } = renderHook(() => useCreateOrganization(), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({ name: 'New Workspace', slug: 'new-workspace' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const nextList = queryClient.getQueryData<ListOrganizationsResponse>(
      organizationsQueryOptions().queryKey,
    )
    expect(nextList?.items.map((item) => item.id)).toEqual([
      'org-new',
      'org-existing',
    ])
    expect(nextList?.pagination.total).toBe(2)
  })
})
