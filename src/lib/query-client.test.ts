import { describe, expect, it } from 'vitest'
import { createQueryClient } from './query-client'

describe('createQueryClient', () => {
  it('sets SPA defaults for queries and mutations', () => {
    const client = createQueryClient()
    const defaults = client.getDefaultOptions()

    expect(defaults.queries?.staleTime).toBe(30_000)
    expect(defaults.queries?.retry).toBe(1)
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false)
    expect(defaults.mutations?.retry).toBe(0)
  })
})
