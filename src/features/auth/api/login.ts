import { apiClient } from '@/lib/api/api-client'
import type { LoginRequest, LoginResponse } from '../auth-api.types'

/** `POST /auth/login` — returns user + tokens. */
export function login(body: LoginRequest) {
  return apiClient.post<LoginResponse>('/auth/login', body)
}
