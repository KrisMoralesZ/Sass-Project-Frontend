import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  setActiveOrganizationId,
} from '../active-organization-storage'
import { useActiveOrganizationId } from './use-active-organization-id'

describe('useActiveOrganizationId', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns the stored active organization id', () => {
    setActiveOrganizationId('org-1')

    const { result } = renderHook(() => useActiveOrganizationId())

    expect(result.current).toBe('org-1')
  })

  it('re-renders when the active organization changes', () => {
    const { result } = renderHook(() => useActiveOrganizationId())

    expect(result.current).toBeNull()

    act(() => {
      setActiveOrganizationId('org-2')
    })

    expect(result.current).toBe('org-2')
  })
})
