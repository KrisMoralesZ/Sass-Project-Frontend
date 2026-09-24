import { apiClient } from '@/lib/api/api-client'
import type { RevokeInvitationResponse } from './invitation-api.types'

/**
 * `POST /invites/:id/revoke` — tenant-scoped; requires `invite:revoke`.
 * Idempotent for already-revoked or expired invites; must not revoke `accepted`.
 */
export function revokeInvitation(invitationId: string) {
  return apiClient.post<RevokeInvitationResponse>(
    `/invites/${invitationId}/revoke`,
  )
}
