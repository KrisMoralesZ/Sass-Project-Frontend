import { apiClient } from '@/lib'
import type { RegisterRequest, RegisterResponse } from '../auth-api.types'

/** `POST /auth/register` — returns user + tokens. */
export function register(body: RegisterRequest) {
  return apiClient.post<RegisterResponse>('/auth/register', body)
}
