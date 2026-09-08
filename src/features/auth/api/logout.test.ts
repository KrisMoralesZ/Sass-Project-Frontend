import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/lib/api/api-client'
import { notifySessionCleared } from '../session-events'
import { logout } from './logout'

vi.mock('@/lib/api/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

vi.mock('../session-events', () => ({
  notifySessionCleared: vi.fn(),
}))

describe('logout', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.mocked(apiClient.post).mockReset()
    vi.mocked(notifySessionCleared).mockClear()
  })

  it('revokes the refresh token and clears local session state', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    sessionStorage.setItem('sass.auth.accessToken', 'access-1')
    sessionStorage.setItem('sass.org.activeOrganizationId', 'org-1')
    vi.mocked(apiClient.post).mockResolvedValue({ message: 'Signed out' })

    await logout()

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', {
      refreshToken: 'refresh-1',
    })
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBeNull()
    expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBeNull()
    expect(notifySessionCleared).toHaveBeenCalledWith('logout')
  })

  it('clears local session state even when no refresh token is stored', async () => {
    sessionStorage.setItem('sass.auth.accessToken', 'access-1')

    await logout()

    expect(apiClient.post).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBeNull()
    expect(notifySessionCleared).toHaveBeenCalledWith('logout')
  })

  it('clears local session state when revocation fails', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(apiClient.post).mockRejectedValue(new Error('network'))

    await logout()

    expect(sessionStorage.getItem('sass.auth.refreshToken')).toBeNull()
    expect(notifySessionCleared).toHaveBeenCalledWith('logout')
  })
})
