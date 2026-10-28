import { apiClient } from '@/lib/api/api-client'
import type {
  AcceptInvitationRequest,
  AcceptInvitationResponse,
} from './invitation-api.types'

/**
 * `POST /invites/accept` — authenticated, not tenant-scoped.
 * Organization comes from the invitation; the signed-in user's email must match.
 */
export function acceptInvitation(body: AcceptInvitationRequest) {
  return apiClient.post<AcceptInvitationResponse>('/invites/accept', body)
}
