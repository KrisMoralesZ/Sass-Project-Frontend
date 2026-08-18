import { apiClient } from '@/lib'
import type { LoginRequest, LoginResponse } from '../auth-api.types'

/** `POST /auth/login` — returns user + tokens. */
export function login(body: LoginRequest) {
  return apiClient.post<LoginResponse>('/auth/login', body)
}
