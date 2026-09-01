import { type FC, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { isApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import {
  ORGANIZATION_PLANS,
  type CreateOrganizationRequest,
} from '@/features/organizations/api/organization-api.types'
import { setActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { useCreateOrganization } from '@/features/organizations/hooks/use-create-organization'
import {
  $Actions,
  $Form,
  $Intro,
  $Page,
  $Panel,
  $PlanSelect,
  $Status,
} from './CreateOrganizationPage.sc'

const ORGANIZATION_SLUG_MAX_LENGTH = 120
const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function validateOrganizationSlug(slug: string): string | undefined {
  if (slug.length > ORGANIZATION_SLUG_MAX_LENGTH) {
    return `Slug must be ${ORGANIZATION_SLUG_MAX_LENGTH} characters or fewer.`
  }

  if (!ORGANIZATION_SLUG_PATTERN.test(slug)) {
    return 'Use lowercase letters, numbers, and single hyphens only.'
  }

  return undefined
}

function getSlugApiError(error: unknown): string | undefined {
  if (!isApiError(error)) {
    return undefined
  }

  if (error.code === ErrorCode.CONFLICT) {
    return getApiErrorMessage(error)
  }

  if (
    error.code === ErrorCode.VALIDATION_FAILED &&
    getApiErrorMessage(error).toLowerCase().includes('slug')
  ) {
    return getApiErrorMessage(error)
  }

  return undefined
}

const CreateOrganizationPage: FC = () => {
  const navigate = useNavigate()
  const createOrganizationMutation = useCreateOrganization()
  const [form, setForm] = useState<CreateOrganizationRequest>({
    name: '',
    slug: '',
    plan: 'FREE',
  })
  const [slugError, setSlugError] = useState<string>()

  const updateField = (
    field: keyof CreateOrganizationRequest,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'slug') {
      setSlugError(undefined)
      createOrganizationMutation.reset()
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedSlug = form.slug?.trim() ?? ''
    const nextSlugError = trimmedSlug
      ? validateOrganizationSlug(trimmedSlug)
      : undefined

    setSlugError(nextSlugError)
    if (nextSlugError) {
      return
    }

    const body = {
      ...form,
      name: form.name.trim(),
      slug: trimmedSlug || undefined,
    }

    createOrganizationMutation.mutate(body, {
      onError: (error) => {
        setSlugError(getSlugApiError(error))
      },
      onSuccess: (organization) => {
        setActiveOrganizationId(organization.id)
        void navigate('/')
      },
    })
  }

  return (
    <$Page>
      <$Intro>
        <span>Workspace setup</span>
        <h1>Create an organization</h1>
        <p>
          Set up a workspace for your team and keep its details in one place.
        </p>
      </$Intro>
      <$Panel>
        <$Form onSubmit={handleSubmit}>
          <FormField
            label="Organization name"
            htmlFor="organization-name"
            required
          >
            <Input
              id="organization-name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Acme Corporation"
              required
              maxLength={120}
              autoComplete="organization"
            />
          </FormField>
          <FormField
            label="Slug"
            htmlFor="organization-slug"
            hint="Optional. Leave blank to generate one from the name."
            error={slugError}
          >
            <Input
              id="organization-slug"
              value={form.slug}
              onChange={(event) => updateField('slug', event.target.value)}
              placeholder="acme-corp"
              maxLength={120}
              pattern="[a-z0-9-]+"
              autoComplete="off"
            />
          </FormField>
          <FormField label="Plan" htmlFor="organization-plan" required>
            <$PlanSelect
              id="organization-plan"
              value={form.plan}
              onChange={(event) => updateField('plan', event.target.value)}
            >
              {ORGANIZATION_PLANS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </$PlanSelect>
          </FormField>
          {createOrganizationMutation.isError ? (
            <$Status role="alert">
              {getApiErrorMessage(createOrganizationMutation.error)}
            </$Status>
          ) : null}
          <$Actions>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createOrganizationMutation.isPending}
            >
              Create organization
            </Button>
          </$Actions>
        </$Form>
      </$Panel>
    </$Page>
  )
}

export default CreateOrganizationPage
