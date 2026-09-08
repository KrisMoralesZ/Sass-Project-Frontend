import { describe, expect, it, vi } from 'vitest'
import { notifySessionCleared, subscribeSessionCleared } from './session-events'

describe('session-events', () => {
  it('notifies subscribers and stops after unsubscribe', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeSessionCleared(listener)

    notifySessionCleared()
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    notifySessionCleared()
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
