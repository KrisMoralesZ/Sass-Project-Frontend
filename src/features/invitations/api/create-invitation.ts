import { apiClient } from '@/lib/api/api-client'
import type {
  CreateInvitationRequest,
  CreateInvitationResponse,
} from './invitation-api.types'

/** `POST /invites` — tenant-scoped; requires `invite:create`. */
export function createInvitation(body: CreateInvitationRequest) {
  return apiClient.post<CreateInvitationResponse>('/invites', body)
}
