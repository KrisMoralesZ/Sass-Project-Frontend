import type { ListQuery, PaginatedResult } from '@/types'

export const ORGANIZATION_PLANS = ['FREE', 'PRO', 'ENTERPRISE'] as const

export type OrganizationPlan = (typeof ORGANIZATION_PLANS)[number]

export const ORGANIZATION_FEATURE_FLAGS = [
  'betaBoards',
  'advancedReports',
  'memberInvites',
  'customBranding',
] as const

export type OrganizationFeatureFlag =
  (typeof ORGANIZATION_FEATURE_FLAGS)[number]

export type OrganizationFeatureFlags = Record<OrganizationFeatureFlag, boolean>

export interface OrganizationBrandingSettings {
  logoUrl: string | null
  primaryColor: string | null
  accentColor: string | null
  appName: string | null
}

/** Mirrors backend `OrganizationSettings` (always fully populated in responses). */
export interface OrganizationSettings {
  timezone: string
  locale: string
  branding: OrganizationBrandingSettings
  featureFlags: OrganizationFeatureFlags
}

/** Mirrors backend `OrganizationSettingsPatchDto`: every field optional. */
export interface OrganizationSettingsPatch {
  timezone?: string
  locale?: string
  branding?: Partial<OrganizationBrandingSettings>
  featureFlags?: Partial<OrganizationFeatureFlags>
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: OrganizationPlan
  settings: OrganizationSettings
  createdAt: string
  updatedAt: string
}

export interface ListOrganizationsQuery extends ListQuery {}

export type ListOrganizationsResponse = PaginatedResult<Organization>

export interface CreateOrganizationRequest {
  name: string
  slug?: string
  plan?: OrganizationPlan
}

export interface UpdateOrganizationRequest {
  name?: string
  slug?: string
  plan?: OrganizationPlan
  settings?: OrganizationSettingsPatch
}

export type CreateOrganizationResponse = Organization
export type UpdateOrganizationResponse = Organization
