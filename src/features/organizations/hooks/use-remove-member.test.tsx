import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { removeMember } from '../api/remove-member'
import { organizationMemberQueryKey } from '../api/get-member'
import { useRemoveMember } from './use-remove-member'

vi.mock('../api/remove-member', () => ({
  removeMember: vi.fn(),
}))

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useRemoveMember', () => {
  beforeEach(() => {
    vi.mocked(removeMember).mockReset()
    vi.mocked(removeMember).mockResolvedValue(undefined)
  })

  it('removes the member, invalidates the member list, and clears cached detail', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    const { result } = renderHook(() => useRemoveMember('org-1', 'user-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(removeMember).toHaveBeenCalledWith('user-1')
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['members', 'org-1'],
    })
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: organizationMemberQueryKey('org-1', 'user-1'),
      exact: true,
    })
  })

  it('skips cache changes without an active organization', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    const { result } = renderHook(() => useRemoveMember('', 'user-1'), {
      wrapper: createWrapper(queryClient),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).not.toHaveBeenCalled()
    expect(removeQueriesSpy).not.toHaveBeenCalled()
  })
})
