import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  consumeSessionExpiredNotice,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
  subscribeSessionCleared,
  type SessionClearedListener,
} from '@/features/auth'
import { ErrorCode, type ApiResponseMeta } from '@/types'
import {
  attachRefreshInterceptor,
  resetRefreshSingleFlight,
} from './refresh-interceptor'

const meta: ApiResponseMeta = {
  timestamp: '2026-08-24T00:00:00.000Z',
  path: '/auth/me',
  version: '1',
}

function envelopeError(statusCode = 401) {
  return {
    success: false as const,
    error: {
      code: ErrorCode.UNAUTHORIZED,
      statusCode,
      message: 'Unauthorized',
    },
    meta,
  }
}

function envelopeOk<T>(data: T, path = '/auth/me') {
  return {
    success: true as const,
    data,
    meta: { ...meta, path },
  }
}

function refreshOkResponse(): AxiosResponse {
  return {
    data: envelopeOk(
      {
        tokens: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          expiresIn: 15,
        },
      },
      '/auth/refresh',
    ),
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  }
}

function unauthorizedError(config: InternalAxiosRequestConfig): AxiosError {
  const error = new AxiosError('Unauthorized')
  error.config = config
  error.response = {
    data: envelopeError(),
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
  }
  return error
}

function createClient(
  adapter: NonNullable<AxiosInstance['defaults']['adapter']>,
): AxiosInstance {
  const instance = axios.create({ adapter })
  attachRefreshInterceptor(instance)
  return instance
}

describe('refresh interceptor (task 1.3.4)', () => {
  let sessionCleared: SessionClearedListener
  let unsubscribe: () => void

  beforeEach(() => {
    sessionStorage.clear()
    resetRefreshSingleFlight()
    sessionCleared = vi.fn()
    unsubscribe = subscribeSessionCleared(sessionCleared)
    setSessionTokens({
      accessToken: 'expired-access',
      refreshToken: 'valid-refresh',
    })
  })

  afterEach(() => {
    unsubscribe()
    resetRefreshSingleFlight()
    vi.restoreAllMocks()
  })

  it('refreshes once, retries, and stays silent when refresh succeeds', async () => {
    const postSpy = vi
      .spyOn(axios, 'post')
      .mockResolvedValue(refreshOkResponse())
    let attempts = 0

    const client = createClient(async (config) => {
      attempts += 1
      const headers = AxiosHeaders.from(config.headers)

      if (attempts === 1) {
        throw unauthorizedError({ ...config, headers })
      }

      expect(headers.get('Authorization')).toBe('Bearer new-access')

      return {
        data: envelopeOk({ id: 'user-1' }),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...config, headers },
      }
    })

    const response = await client.get('/auth/me')

    expect(response.data).toEqual(envelopeOk({ id: 'user-1' }))
    expect(attempts).toBe(2)
    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(postSpy.mock.calls[0]?.[0]).toBe(
      'http://localhost:3000/api/v1/auth/refresh',
    )
    expect(postSpy.mock.calls[0]?.[1]).toEqual({
      refreshToken: 'valid-refresh',
    })
    expect(getAccessToken()).toBe('new-access')
    expect(getRefreshToken()).toBe('new-refresh')
    expect(sessionCleared).not.toHaveBeenCalled()
    expect(consumeSessionExpiredNotice()).toBe(false)
  })

  it('single-flights concurrent 401s through one refresh call', async () => {
    let resolveRefresh: ((value: AxiosResponse) => void) | undefined
    const refreshGate = new Promise<AxiosResponse>((resolve) => {
      resolveRefresh = resolve
    })
    const postSpy = vi.spyOn(axios, 'post').mockReturnValue(refreshGate)

    const client = createClient(async (config) => {
      const headers = AxiosHeaders.from(config.headers)
      const auth = headers.get('Authorization')

      if (auth === 'Bearer new-access') {
        return {
          data: envelopeOk({ ok: true }, config.url ?? '/'),
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { ...config, headers },
        }
      }

      throw unauthorizedError({ ...config, headers })
    })

    const first = client.get('/auth/me')
    const second = client.get('/users/me')

    await vi.waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1)
    })

    resolveRefresh?.(refreshOkResponse())

    await Promise.all([first, second])

    expect(postSpy).toHaveBeenCalledTimes(1)
    expect(sessionCleared).not.toHaveBeenCalled()
    expect(consumeSessionExpiredNotice()).toBe(false)
  })

  it('does not refresh skipped auth paths', async () => {
    const postSpy = vi.spyOn(axios, 'post')
    const client = createClient(async (config) => {
      throw unauthorizedError({
        ...config,
        headers: AxiosHeaders.from(config.headers),
      })
    })

    await expect(client.post('/auth/login', {})).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(postSpy).not.toHaveBeenCalled()
    expect(getAccessToken()).toBe('expired-access')
    expect(sessionCleared).not.toHaveBeenCalled()
  })

  it('clears the session when refresh fails', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(
      new AxiosError('Unauthorized', undefined, undefined, undefined, {
        data: envelopeError(),
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }),
    )

    const client = createClient(async (config) => {
      throw unauthorizedError({
        ...config,
        headers: AxiosHeaders.from(config.headers),
      })
    })

    await expect(client.get('/auth/me')).rejects.toBeDefined()

    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(sessionCleared).toHaveBeenCalledWith('expired')
    expect(consumeSessionExpiredNotice()).toBe(true)
  })
})
