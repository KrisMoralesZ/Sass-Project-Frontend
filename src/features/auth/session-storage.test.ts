import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  hasSession,
  setSessionTokens,
} from './session-storage'

describe('session-storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('round-trips access and refresh tokens', () => {
    expect(hasSession()).toBe(false)

    setSessionTokens({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    })

    expect(getAccessToken()).toBe('access-1')
    expect(getRefreshToken()).toBe('refresh-1')
    expect(hasSession()).toBe(true)
  })

  it('clears both tokens', () => {
    setSessionTokens({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    })
    clearSessionTokens()

    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(hasSession()).toBe(false)
  })
})
