import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearActiveOrganizationId,
  getActiveOrganizationId,
  setActiveOrganizationId,
  subscribeActiveOrganizationId,
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

  it('notifies subscribers when the active organization changes', () => {
    let renderCount = 0
    const unsubscribe = subscribeActiveOrganizationId(() => {
      renderCount += 1
    })

    setActiveOrganizationId('org-1')
    clearActiveOrganizationId()
    unsubscribe()
    setActiveOrganizationId('org-2')

    expect(renderCount).toBe(2)
  })
})
