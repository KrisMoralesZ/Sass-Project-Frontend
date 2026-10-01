import { beforeEach, describe, expect, it } from 'vitest'
import {
  getStoredThemePreference,
  setStoredThemePreference,
} from './theme-preference-storage'

describe('theme-preference-storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns null when nothing is stored', () => {
    expect(getStoredThemePreference()).toBeNull()
  })

  it('stores and reads a valid preference', () => {
    setStoredThemePreference('dark')
    expect(getStoredThemePreference()).toBe('dark')
  })

  it('ignores invalid stored values', () => {
    sessionStorage.setItem('sass.theme.preference', 'neon')
    expect(getStoredThemePreference()).toBeNull()
  })
})
