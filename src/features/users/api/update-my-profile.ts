import { apiClient } from '@/lib/api/api-client'
import type {
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
} from './user-api.types'

/** Thin API helper for `PATCH /users/me` (user-scoped; org header optional). */
export function updateMyProfile(body: UpdateUserProfileRequest) {
  return apiClient.patch<UpdateUserProfileResponse>('/users/me', body)
}
