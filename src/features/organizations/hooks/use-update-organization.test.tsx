import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { organizationQueryKey } from '../api/get-organization'
import { updateOrganization } from '../api/update-organization'
import type { Organization } from '../api/organization-api.types'
import { useUpdateOrganization } from './use-update-organization'

vi.mock('../api/update-organization', () => ({
  updateOrganization: vi.fn(),
}))

const organization: Organization = {
  id: 'org-1',
  name: 'Updated Workspace',
  slug: 'updated',
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
  updatedAt: '2026-01-02T00:00:00.000Z',
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useUpdateOrganization', () => {
  beforeEach(() => {
    vi.mocked(updateOrganization).mockReset()
    vi.mocked(updateOrganization).mockResolvedValue(organization)
  })

  it('refreshes the organization detail cache on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const { result } = renderHook(() => useUpdateOrganization('org-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate({ name: 'Updated Workspace' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(updateOrganization).toHaveBeenCalledWith('org-1', {
      name: 'Updated Workspace',
    })
    expect(queryClient.getQueryData(organizationQueryKey('org-1'))).toEqual(
      organization,
    )
  })
})
