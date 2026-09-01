import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent } from 'storybook/test'
import styled from 'styled-components'
import {
  clearActiveOrganizationId,
  setActiveOrganizationId,
} from '@/features/organizations/active-organization-storage'
import { tenantContextQueryKey } from '@/features/organizations/api/get-tenant-context'
import { organizationsQueryOptions } from '@/features/organizations/api/list-organizations'
import type { Organization } from '@/features/organizations/api/organization-api.types'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import OrganizationSwitcher from '.'

const SidebarFrame = styled.div`
  width: 15.5rem;
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`

const SETTINGS: Organization['settings'] = {
  timezone: 'UTC',
  locale: 'en',
  branding: {
    logoUrl: null,
    primaryColor: null,
    accentColor: null,
    appName: null,
  },
  featureFlags: {
    betaBoards: false,
    advancedReports: false,
    memberInvites: false,
    customBranding: false,
  },
}

function makeOrganization(
  id: string,
  name: string,
  slug: string,
): Organization {
  return {
    id,
    name,
    slug,
    plan: 'FREE',
    settings: SETTINGS,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  }
}

const ACME = makeOrganization('org-acme', 'Acme', 'acme')
const GLOBEX = makeOrganization('org-globex', 'Globex', 'globex')
const ORGANIZATIONS = [ACME, GLOBEX]

const LIST_ERROR = new ApiError({
  code: ErrorCode.INTERNAL_SERVER_ERROR,
  statusCode: 500,
  message: 'Failed to load organizations',
})

const TENANT_ERROR = new ApiError({
  code: ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
  statusCode: 403,
  message: 'You do not have access to this workspace.',
})

function seedOrganizations(client: QueryClient, items: Organization[]): void {
  client.setQueryData(organizationsQueryOptions().queryKey, {
    items,
    pagination: {
      page: 1,
      limit: 20,
      total: items.length,
      totalPages: items.length === 0 ? 0 : 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  })

  for (const organization of items) {
    client.setQueryData(tenantContextQueryKey(organization.id), {
      organizationId: organization.id,
    })
  }
}

function setQueryError(
  client: QueryClient,
  queryKey: readonly unknown[],
  error: Error,
): void {
  client
    .getQueryCache()
    .build(client, {
      queryKey,
      queryFn: () => Promise.reject(error),
    })
    .setState({
      status: 'error',
      error,
      fetchStatus: 'idle',
      data: undefined,
    })
}

function OrganizationSwitcherHarness({
  activeOrgId = null,
  seed,
}: {
  activeOrgId?: string | null
  seed?: (client: QueryClient) => void
}) {
  const [client] = useState(() => {
    const next = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          gcTime: Infinity,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          enabled: false,
        },
      },
    })
    seed?.(next)
    return next
  })

  if (activeOrgId) {
    setActiveOrganizationId(activeOrgId)
  } else {
    clearActiveOrganizationId()
  }

  return (
    <QueryClientProvider client={client}>
      <SidebarFrame>
        <OrganizationSwitcher />
      </SidebarFrame>
    </QueryClientProvider>
  )
}

const meta = {
  title: 'Layout/OrganizationSwitcher',
  component: OrganizationSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OrganizationSwitcher>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <OrganizationSwitcherHarness
      activeOrgId={ACME.id}
      seed={(client) => seedOrganizations(client, ORGANIZATIONS)}
    />
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox')
    await expect(select).toHaveValue(ACME.id)
    await expect(select).toHaveDisplayValue('Acme')
    await expect(canvas.getByRole('option', { name: 'Acme' })).toHaveValue(
      ACME.id,
    )
    await expect(canvas.getByRole('option', { name: 'Globex' })).toHaveValue(
      GLOBEX.id,
    )
  },
}

export const Loading: Story = {
  render: () => <OrganizationSwitcherHarness />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading...')).toBeVisible()
  },
}

export const Empty: Story = {
  render: () => (
    <OrganizationSwitcherHarness
      seed={(client) => seedOrganizations(client, [])}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No organizations')).toBeVisible()
  },
}

export const LoadError: Story = {
  render: () => (
    <OrganizationSwitcherHarness
      seed={(client) =>
        setQueryError(client, organizationsQueryOptions().queryKey, LIST_ERROR)
      }
    />
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Something went wrong on our side. Please try again.'),
    ).toBeVisible()
  },
}

export const UnavailableWorkspace: Story = {
  render: () => (
    <OrganizationSwitcherHarness
      activeOrgId={ACME.id}
      seed={(client) => {
        seedOrganizations(client, ORGANIZATIONS)
        setQueryError(client, tenantContextQueryKey(ACME.id), TENANT_ERROR)
      }}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toHaveValue(ACME.id)
  },
}

export const SwitchWorkspace: Story = {
  render: () => (
    <OrganizationSwitcherHarness
      activeOrgId={ACME.id}
      seed={(client) => seedOrganizations(client, ORGANIZATIONS)}
    />
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox')
    await expect(select).toHaveValue(ACME.id)

    await userEvent.selectOptions(select, GLOBEX.id)

    await expect(select).toHaveValue(GLOBEX.id)
    await expect(select).toHaveDisplayValue('Globex')
  },
}
