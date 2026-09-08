import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAuthSession } from './useAuthSession'

describe('useAuthSession', () => {
  it('throws when used outside AuthSessionProvider', () => {
    expect(() => renderHook(() => useAuthSession())).toThrow(
      /must be used within AuthSessionProvider/,
    )
  })
})
