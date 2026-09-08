import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorCode } from '@/types/error-code'
import { ORGANIZATION_ID_HEADER } from './constants'
import { apiClient, http } from './api-client'
import { ApiError } from './api-error'

const meta = {
  timestamp: '2026-01-01T00:00:00.000Z',
  path: '/widgets',
  version: '1',
}

function okEnvelope<T>(data: T) {
  return { success: true as const, data, meta }
}

function errorEnvelope(code: string, statusCode: number, message: string) {
  return {
    success: false as const,
    error: { code, statusCode, message },
    meta,
  }
}

describe('apiClient', () => {
  const originalAdapter = http.defaults.adapter
  let lastConfig: InternalAxiosRequestConfig | undefined

  beforeEach(() => {
    sessionStorage.clear()
    lastConfig = undefined
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
    http.defaults.adapter = async (config) => {
      lastConfig = config
      return {
        data: okEnvelope({ id: '1' }),
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } satisfies AxiosResponse
    }
  })

  afterEach(() => {
    http.defaults.adapter = originalAdapter
    vi.unstubAllEnvs()
  })

  it('unwraps success envelopes and sets auth plus org headers', async () => {
    sessionStorage.setItem('sass.auth.accessToken', 'access-token')
    sessionStorage.setItem('sass.org.activeOrganizationId', 'org-1')

    await expect(apiClient.get<{ id: string }>('/widgets')).resolves.toEqual({
      id: '1',
    })
    await expect(apiClient.delete('/widgets/1')).resolves.toEqual({ id: '1' })
    await expect(apiClient.put('/widgets/1', {})).resolves.toEqual({ id: '1' })
    await expect(apiClient.patch('/widgets/1', {})).resolves.toEqual({
      id: '1',
    })

    expect(lastConfig?.baseURL).toBe('http://localhost:3000/api/v1')
    expect(lastConfig?.headers.get('Authorization')).toBe('Bearer access-token')
    expect(lastConfig?.headers.get(ORGANIZATION_ID_HEADER)).toBe('org-1')
  })

  it('throws ApiError from an error envelope on HTTP 200', async () => {
    http.defaults.adapter = async (config) => ({
      data: errorEnvelope(ErrorCode.FORBIDDEN, 403, 'No access'),
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    await expect(apiClient.get('/widgets')).rejects.toMatchObject({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
    })
  })

  it('throws ApiError.network when there is no response', async () => {
    http.defaults.adapter = async (config) => {
      throw new AxiosError(
        'Network Error',
        'ERR_NETWORK',
        config,
        undefined,
        undefined,
      )
    }

    await expect(apiClient.get('/widgets')).rejects.toBeInstanceOf(ApiError)
    await expect(apiClient.get('/widgets')).rejects.toMatchObject({
      statusCode: 0,
    })
  })

  it('throws ApiError from an error envelope on HTTP error status', async () => {
    http.defaults.adapter = async (config) => {
      const headers = new AxiosHeaders()
      throw new AxiosError('Forbidden', 'ERR_BAD_REQUEST', config, undefined, {
        data: errorEnvelope(ErrorCode.FORBIDDEN, 403, 'No access'),
        status: 403,
        statusText: 'Forbidden',
        headers,
        config,
      })
    }

    await expect(
      apiClient.post('/widgets', { name: 'x' }),
    ).rejects.toMatchObject({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
    })
  })

  it('throws ApiError.unexpected for a non-envelope HTTP 200 body', async () => {
    http.defaults.adapter = async (config) => ({
      data: { notAnEnvelope: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    await expect(apiClient.get('/widgets')).rejects.toMatchObject({
      statusCode: 200,
      message: 'Unexpected API response.',
    })
  })

  it('throws ApiError.unexpected for a non-envelope HTTP error body', async () => {
    http.defaults.adapter = async (config) => {
      const headers = new AxiosHeaders()
      throw new AxiosError(
        'Bad Gateway',
        'ERR_BAD_RESPONSE',
        config,
        undefined,
        {
          data: '<html>gateway error</html>',
          status: 502,
          statusText: 'Bad Gateway',
          headers,
          config,
        },
      )
    }

    await expect(apiClient.get('/widgets')).rejects.toMatchObject({
      statusCode: 502,
      message: 'Unexpected API response.',
    })
  })
})
