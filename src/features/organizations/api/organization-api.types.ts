import type { ListQuery, PaginatedResult } from '@/types'

export const ORGANIZATION_PLANS = ['FREE', 'PRO', 'ENTERPRISE'] as const

export type OrganizationPlan = (typeof ORGANIZATION_PLANS)[number]

export interface OrganizationSettings {
  timezone?: string
  locale?: string
  branding?: Record<string, unknown>
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
  settings?: OrganizationSettings
}

export type CreateOrganizationResponse = Organization
export type UpdateOrganizationResponse = Organization
