import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from 'axios'
import { getAccessToken } from '@/features/auth'
import { getActiveOrganizationId } from '@/features/organizations'
import { getApiUrl } from '@/lib/env'
import {
  isApiErrorResponse,
  isApiSuccessResponse,
  type ApiResponse,
} from '@/types'
import { ApiError } from './api-error'
import { ORGANIZATION_ID_HEADER } from './constants'
import { attachRefreshInterceptor } from './refresh-interceptor'

type ApiRequestConfig = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config) => {
    config.baseURL = getApiUrl()

    const accessToken = getAccessToken()
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    // Apply the current tenant context to every request made through apiClient.
    const organizationId = getActiveOrganizationId()
    if (organizationId) {
      config.headers.set(ORGANIZATION_ID_HEADER, organizationId)
    }

    return config
  })

  attachRefreshInterceptor(instance)

  return instance
}

/** Shared axios instance. Prefer `apiClient` helpers so responses stay unwrapped. */
export const http = createAxiosInstance()

async function request<T>(
  method: Method,
  url: string,
  data?: unknown,
  config?: ApiRequestConfig,
): Promise<T> {
  try {
    const response = await http.request<ApiResponse<T>>({
      ...config,
      method,
      url,
      data,
    })

    const body = response.data

    if (isApiSuccessResponse<T>(body)) {
      return body.data
    }

    if (isApiErrorResponse(body)) {
      throw ApiError.fromErrorBody(body.error, body.meta)
    }

    throw ApiError.unexpected(response.status, body)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw ApiError.network(error)
      }

      const body = error.response.data

      if (isApiErrorResponse(body)) {
        throw ApiError.fromErrorBody(body.error, body.meta, error)
      }

      throw ApiError.unexpected(error.response.status, error)
    }

    throw ApiError.unexpected(0, error)
  }
}

/**
 * Typed API client: paths are relative to `/api/v1`, responses are unwrapped `data`.
 */
export const apiClient = {
  get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return request<T>('GET', url, undefined, config)
  },
  delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return request<T>('DELETE', url, undefined, config)
  },
  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return request<T>('POST', url, data, config)
  },
  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return request<T>('PUT', url, data, config)
  },
  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return request<T>('PATCH', url, data, config)
  },
}
