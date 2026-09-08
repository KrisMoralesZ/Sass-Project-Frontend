import { describe, expect, it } from 'vitest'
import { getPasswordError, PASSWORD_MAX_LENGTH } from './password'

describe('getPasswordError', () => {
  it('requires a password', () => {
    expect(getPasswordError('')).toBe('Password is required')
  })

  it('enforces minimum length', () => {
    expect(getPasswordError('Ab1')).toMatch(/at least 8 characters/)
  })

  it('enforces maximum length', () => {
    const tooLong = `A1a${'x'.repeat(PASSWORD_MAX_LENGTH)}`
    expect(getPasswordError(tooLong)).toMatch(/at most 72 characters/)
  })

  it('requires uppercase, lowercase, and a number', () => {
    expect(getPasswordError('password1')).toMatch(/uppercase/i)
    expect(getPasswordError('PASSWORD1')).toMatch(/lowercase/i)
    expect(getPasswordError('Password')).toMatch(/number/i)
  })

  it('accepts a valid password', () => {
    expect(getPasswordError('Password1')).toBeNull()
  })
})
