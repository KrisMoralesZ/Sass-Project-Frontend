import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearActiveOrganizationId,
  getActiveOrganizationId,
  setActiveOrganizationId,
} from './active-organization-storage'

describe('active-organization-storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores and clears the active organization id', () => {
    expect(getActiveOrganizationId()).toBeNull()

    setActiveOrganizationId('org-1')
    expect(getActiveOrganizationId()).toBe('org-1')

    clearActiveOrganizationId()
    expect(getActiveOrganizationId()).toBeNull()
  })
})
