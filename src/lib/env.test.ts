import { afterEach, describe, expect, it, vi } from 'vitest'
import { getApiBaseUrl, getApiUrl } from './env'

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('normalizes VITE_API_URL and appends /api/v1', () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000/')

    expect(getApiBaseUrl()).toBe('http://localhost:3000')
    expect(getApiUrl()).toBe('http://localhost:3000/api/v1')
  })

  it('throws when VITE_API_URL is missing', () => {
    vi.stubEnv('VITE_API_URL', '')

    expect(() => getApiBaseUrl()).toThrow(/Missing VITE_API_URL/)
  })

  it('throws when VITE_API_URL is not an absolute URL', () => {
    vi.stubEnv('VITE_API_URL', 'not-a-url')

    expect(() => getApiBaseUrl()).toThrow(/Invalid VITE_API_URL/)
  })
})
