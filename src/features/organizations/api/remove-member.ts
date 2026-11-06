import { apiClient } from '@/lib/api/api-client'

/** `DELETE /members/:userId` — removes the member from the active workspace. */
export function removeMember(userId: string): Promise<void> {
  return apiClient.delete<void>(`/members/${userId}`)
}
