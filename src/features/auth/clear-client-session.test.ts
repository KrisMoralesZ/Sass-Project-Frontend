import { beforeEach, describe, expect, it, vi } from 'vitest'
import { notifySessionCleared } from './session-events'
import { setSessionExpiredNotice } from './session-expired-notice'
import { clearClientSession } from './clear-client-session'
import { setSessionTokens } from './session-storage'
import { setActiveOrganizationId } from '../organizations/active-organization-storage'

vi.mock('./session-events', () => ({
  notifySessionCleared: vi.fn(),
}))

vi.mock('./session-expired-notice', () => ({
  setSessionExpiredNotice: vi.fn(),
}))

describe('clearClientSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(notifySessionCleared).mockClear()
    vi.mocked(setSessionExpiredNotice).mockClear()
  })

  it('clears tokens, org context, and notifies listeners', () => {
    setSessionTokens({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    })
    setActiveOrganizationId('org-1')

    clearClientSession('logout')

    expect(sessionStorage.getItem('sass.auth.accessToken')).toBeNull()
    expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBeNull()
    expect(setSessionExpiredNotice).not.toHaveBeenCalled()
    expect(notifySessionCleared).toHaveBeenCalledWith('logout')
  })

  it('sets the expired notice when the session expires', () => {
    clearClientSession('expired')

    expect(setSessionExpiredNotice).toHaveBeenCalledOnce()
    expect(notifySessionCleared).toHaveBeenCalledWith('expired')
  })
})
