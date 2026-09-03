import { describe, expect, it } from 'vitest'
import type {
  Organization,
  ListOrganizationsResponse,
} from './api/organization-api.types'
import {
  chooseActiveOrganizationId,
  omitOrganizationFromList,
} from './restore-active-organization'

function organization(id: string): Organization {
  return {
    id,
    name: id,
    slug: id,
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
}

describe('chooseActiveOrganizationId', () => {
  it('keeps the stored id when it is still available', () => {
    expect(chooseActiveOrganizationId('org-a', ['org-b', 'org-a'])).toBe(
      'org-a',
    )
  })

  it('falls back to the first remaining workspace after archive', () => {
    expect(chooseActiveOrganizationId('org-archived', ['org-b', 'org-c'])).toBe(
      'org-b',
    )
  })

  it('clears the selection when no workspaces remain', () => {
    expect(chooseActiveOrganizationId('org-archived', [])).toBeNull()
    expect(chooseActiveOrganizationId(null, [])).toBeNull()
  })
})

describe('omitOrganizationFromList', () => {
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

  it('removes the archived workspace and decrements the list total', () => {
    const next = omitOrganizationFromList(list, 'org-a')

    expect(next.items.map((item) => item.id)).toEqual(['org-b'])
    expect(next.pagination.total).toBe(1)
  })
})
