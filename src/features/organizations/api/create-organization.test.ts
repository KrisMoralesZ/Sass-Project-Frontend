import { describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { createOrganization } from './create-organization'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

describe('createOrganization', () => {
  it('posts the workspace payload to /organizations', async () => {
    const organization = {
      id: 'org-1',
      name: 'Acme',
      slug: 'acme',
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
    vi.mocked(apiClient.post).mockResolvedValue(organization)

    await expect(
      createOrganization({ name: 'Acme', slug: 'acme' }),
    ).resolves.toEqual(organization)
    expect(apiClient.post).toHaveBeenCalledWith('/organizations', {
      name: 'Acme',
      slug: 'acme',
    })
  })
})
