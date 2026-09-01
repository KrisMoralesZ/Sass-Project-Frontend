import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { RefreshResponse } from '@/features/auth/auth-api.types'
import { clearClientSession } from '@/features/auth/clear-client-session'
import {
  getRefreshToken,
  setSessionTokens,
} from '@/features/auth/session-storage'
import { notifySessionCleared } from '@/features/auth/session-events'
import { clearActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { getApiUrl } from '@/lib/env'
import { ErrorCode } from '@/types/error-code'
import { isApiErrorResponse, isApiSuccessResponse } from '@/types/api-response'
import type { ApiResponse } from '@/types/api-response'
import { ApiError } from './api-error'

const REFRESH_PATH = '/auth/refresh'

const SKIP_REFRESH_PATHS = [
  '/auth/refresh',
  '/auth/login',
  '/auth/register',
  '/auth/logout',
] as const

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshInFlight: Promise<string> | null = null

/** Test-only: drop a stuck in-flight refresh between cases. */
export function resetRefreshSingleFlight(): void {
  refreshInFlight = null
}

function shouldSkipRefresh(config?: InternalAxiosRequestConfig): boolean {
  const url = config?.url ?? ''
  return SKIP_REFRESH_PATHS.some((path) => url === path || url.endsWith(path))
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearClientSession()
    throw new ApiError({
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      message: 'Session expired. Please sign in again.',
    })
  }

  try {
    // Bare axios call — avoids hitting this interceptor recursively.
    const response = await axios.post<ApiResponse<RefreshResponse>>(
      `${getApiUrl()}${REFRESH_PATH}`,
      { refreshToken },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    const body = response.data

    if (!isApiSuccessResponse<RefreshResponse>(body)) {
      if (isApiErrorResponse(body)) {
        throw ApiError.fromErrorBody(body.error, body.meta)
      }
      throw ApiError.unexpected(response.status, body)
    }

    const { accessToken, refreshToken: nextRefreshToken } = body.data.tokens
    setSessionTokens({
      accessToken,
      refreshToken: nextRefreshToken,
    })

    return accessToken
  } catch (error) {
    clearClientSession()

    if (error instanceof ApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      const body = error.response?.data
      if (isApiErrorResponse(body)) {
        throw ApiError.fromErrorBody(body.error, body.meta, error)
      }
      if (!error.response) {
        throw ApiError.network(error)
      }
      throw ApiError.unexpected(error.response.status, error)
    }

    throw ApiError.unexpected(0, error)
  }
}

function refreshAccessTokenSingleFlight(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

/**
 * On 401: refresh once (shared in-flight promise), retry the request.
 * Success stays silent (task 1.3.4): new tokens in sessionStorage, no toast,
 * no redirect, no `notifySessionCleared`. Failed refresh still clears the session.
 */
export function attachRefreshInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const original = error.config as RetriableConfig | undefined

      if (
        status !== 401 ||
        !original ||
        original._retry ||
        shouldSkipRefresh(original)
      ) {
        return Promise.reject(error)
      }

      original._retry = true

      try {
        const accessToken = await refreshAccessTokenSingleFlight()
        original.headers.set('Authorization', `Bearer ${accessToken}`)
        return instance.request(original)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    },
  )
}
