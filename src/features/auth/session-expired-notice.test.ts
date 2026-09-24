import { beforeEach, describe, expect, it } from 'vitest'
import {
  consumeSessionExpiredNotice,
  setSessionExpiredNotice,
} from './session-expired-notice'

describe('session-expired-notice', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('sets and consumes the one-shot notice flag', () => {
    expect(consumeSessionExpiredNotice()).toBe(false)

    setSessionExpiredNotice()

    expect(consumeSessionExpiredNotice()).toBe(true)
    expect(consumeSessionExpiredNotice()).toBe(false)
  })
})
