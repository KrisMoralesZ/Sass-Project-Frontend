import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { notifySessionCleared } from '@/features/auth/session-events'
import AppQueryProvider from './AppQueryProvider'

function QueryClientProbe({
  onClient,
}: {
  onClient: (client: QueryClient) => void
}) {
  onClient(useQueryClient())
  return null
}

describe('AppQueryProvider', () => {
  it('provides a query client to descendants', () => {
    let clientFromTree: QueryClient | undefined

    render(
      <AppQueryProvider>
        <QueryClientProbe
          onClient={(client) => {
            clientFromTree = client
          }}
        />
      </AppQueryProvider>,
    )

    const staleTime = clientFromTree?.getDefaultOptions().queries?.staleTime
    expect(staleTime).toBe(30_000)
  })

  it('invalidates auth queries when the session is cleared externally', async () => {
    const invalidateQueries = vi.fn().mockResolvedValue(undefined)

    function SessionClearProbe() {
      const client = useQueryClient()
      client.invalidateQueries = invalidateQueries
      return null
    }

    render(
      <AppQueryProvider>
        <SessionClearProbe />
      </AppQueryProvider>,
    )

    notifySessionCleared('expired')

    await waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['auth'],
        refetchType: 'none',
      })
    })
  })
})
