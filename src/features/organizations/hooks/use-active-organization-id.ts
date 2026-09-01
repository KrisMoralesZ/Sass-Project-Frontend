import { useSyncExternalStore } from 'react'
import {
  getActiveOrganizationId,
  subscribeActiveOrganizationId,
} from '../active-organization-storage'

/** Active workspace id that re-renders subscribers when the org changes. */
export const useActiveOrganizationId = (): string | null =>
  useSyncExternalStore(subscribeActiveOrganizationId, getActiveOrganizationId)
