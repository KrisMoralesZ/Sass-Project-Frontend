import { describe, expect, it } from 'vitest'
import { resolveThemeMode } from './theme-mode'

describe('resolveThemeMode', () => {
  it('uses light and dark preferences directly', () => {
    expect(resolveThemeMode('light', true)).toBe('light')
    expect(resolveThemeMode('dark', false)).toBe('dark')
  })

  it('follows the OS preference when set to system', () => {
    expect(resolveThemeMode('system', false)).toBe('light')
    expect(resolveThemeMode('system', true)).toBe('dark')
  })
})
