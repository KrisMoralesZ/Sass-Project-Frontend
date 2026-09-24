import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorCode } from '@/types/error-code'
import { ApiError } from './api-error'
import {
  attachRefreshInterceptor,
  resetRefreshSingleFlight,
} from './refresh-interceptor'

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>()
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
      isAxiosError: actual.default.isAxiosError,
    },
  }
})

describe('attachRefreshInterceptor', () => {
  let instance: AxiosInstance
  let callCount: number

  beforeEach(() => {
    sessionStorage.clear()
    callCount = 0
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
    vi.mocked(axios.post).mockReset()

    instance = axios.create()
    attachRefreshInterceptor(instance)

    instance.defaults.adapter = async (config) => {
      callCount += 1
      if (callCount === 1) {
        const headers = new AxiosHeaders()
        throw new AxiosError(
          'Unauthorized',
          'ERR_BAD_REQUEST',
          config,
          undefined,
          {
            data: {},
            status: 401,
            statusText: 'Unauthorized',
            headers,
            config,
          },
        )
      }

      return {
        data: { retried: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } satisfies AxiosResponse
    }
  })

  afterEach(() => {
    resetRefreshSingleFlight()
    vi.unstubAllEnvs()
  })

  it('refreshes once and retries the original request', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          tokens: {
            accessToken: 'access-2',
            refreshToken: 'refresh-2',
            expiresIn: 900,
          },
        },
        meta: {
          timestamp: '2026-01-01T00:00:00.000Z',
          path: '/auth/refresh',
          version: '1',
        },
      },
    })

    await expect(instance.get('/widgets')).resolves.toMatchObject({
      data: { retried: true },
    })
    expect(callCount).toBe(2)
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('sass.auth.accessToken')).toBe('access-2')
  })

  it('does not refresh login requests', async () => {
    await expect(instance.post('/auth/login', {})).rejects.toBeInstanceOf(
      AxiosError,
    )
    expect(axios.post).not.toHaveBeenCalled()
    expect(callCount).toBe(1)
  })

  it('clears the session when refresh returns an error envelope', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          statusCode: 401,
          message: 'Invalid refresh token',
        },
        meta: {
          timestamp: '2026-01-01T00:00:00.000Z',
          path: '/auth/refresh',
          version: '1',
        },
      },
    })

    await expect(instance.get('/widgets')).rejects.toBeInstanceOf(ApiError)
    expect(sessionStorage.getItem('sass.auth.refreshToken')).toBeNull()
    expect(callCount).toBe(1)
  })

  it('clears the session when there is no refresh token', async () => {
    sessionStorage.setItem('sass.org.activeOrganizationId', 'org-1')

    await expect(instance.get('/widgets')).rejects.toBeInstanceOf(ApiError)
    expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBeNull()
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('shares one refresh when multiple requests get 401', async () => {
    instance.defaults.adapter = async (config) => {
      callCount += 1
      const retriable = config as { _retry?: boolean }
      if (!retriable._retry) {
        const headers = new AxiosHeaders()
        throw new AxiosError(
          'Unauthorized',
          'ERR_BAD_REQUEST',
          config,
          undefined,
          {
            data: {},
            status: 401,
            statusText: 'Unauthorized',
            headers,
            config,
          },
        )
      }

      return {
        data: { retried: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } satisfies AxiosResponse
    }

    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          tokens: {
            accessToken: 'access-2',
            refreshToken: 'refresh-2',
            expiresIn: 900,
          },
        },
        meta: {
          timestamp: '2026-01-01T00:00:00.000Z',
          path: '/auth/refresh',
          version: '1',
        },
      },
    })

    await Promise.all([instance.get('/widgets'), instance.get('/widgets/2')])

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(callCount).toBe(4)
  })

  it('does not refresh register or logout requests', async () => {
    instance.defaults.adapter = async (config) => {
      const headers = new AxiosHeaders()
      throw new AxiosError(
        'Unauthorized',
        'ERR_BAD_REQUEST',
        config,
        undefined,
        {
          data: {},
          status: 401,
          statusText: 'Unauthorized',
          headers,
          config,
        },
      )
    }

    await expect(instance.post('/auth/register', {})).rejects.toBeInstanceOf(
      AxiosError,
    )
    await expect(instance.post('/auth/logout', {})).rejects.toBeInstanceOf(
      AxiosError,
    )
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('clears the session when refresh returns an unexpected body', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(axios.post).mockResolvedValue({
      data: { notAnEnvelope: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    })

    await expect(instance.get('/widgets')).rejects.toMatchObject({
      message: 'Unexpected API response.',
    })
    expect(sessionStorage.getItem('sass.auth.refreshToken')).toBeNull()
  })

  it('clears the session when refresh hits a network error', async () => {
    sessionStorage.setItem('sass.auth.refreshToken', 'refresh-1')
    vi.mocked(axios.post).mockRejectedValue(
      new AxiosError('Network Error', 'ERR_NETWORK'),
    )

    await expect(instance.get('/widgets')).rejects.toMatchObject({
      statusCode: 0,
    })
    expect(sessionStorage.getItem('sass.auth.refreshToken')).toBeNull()
  })
})
