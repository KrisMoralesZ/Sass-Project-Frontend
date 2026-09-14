import { describe, expect, it } from 'vitest'
import { darkTheme, getAppTheme, lightTheme } from './theme'

describe('getAppTheme', () => {
  it('returns the light and dark token sets', () => {
    expect(getAppTheme('light')).toBe(lightTheme)
    expect(getAppTheme('dark')).toBe(darkTheme)
  })

  it('uses distinct surface colors between modes', () => {
    expect(lightTheme.colors.surface).not.toBe(darkTheme.colors.surface)
    expect(darkTheme.colors.background).toMatch(/^#0f/i)
  })
})
