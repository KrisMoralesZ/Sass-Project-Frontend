import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { getApiErrorMessage } from '@/lib'
import {
  ORGANIZATION_PLANS,
  setActiveOrganizationId,
  useCreateOrganization,
  type CreateOrganizationRequest,
} from '@/features/organizations'
import {
  $Actions,
  $Form,
  $Intro,
  $Page,
  $Panel,
  $PlanSelect,
  $Status,
} from './CreateOrganizationPage.sc'

export function CreateOrganizationPage() {
  const navigate = useNavigate()
  const createOrganizationMutation = useCreateOrganization()
  const [form, setForm] = useState<CreateOrganizationRequest>({
    name: '',
    slug: '',
    plan: 'FREE',
  })

  const updateField = (field: keyof CreateOrganizationRequest, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = {
      ...form,
      name: form.name.trim(),
      slug: form.slug?.trim() || undefined,
    }

    createOrganizationMutation.mutate(body, {
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
