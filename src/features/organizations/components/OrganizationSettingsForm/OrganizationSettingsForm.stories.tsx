import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import styled from 'styled-components'
import type { OrganizationSettings } from '../../api/organization-api.types'
import OrganizationSettingsForm from '.'

const Frame = styled.div`
  width: 100%;
  max-width: 46rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
`

const settings: OrganizationSettings = {
  timezone: 'America/New_York',
  locale: 'en',
  branding: {
    logoUrl: 'https://cdn.example.com/logo.png',
    primaryColor: '#1a5c40',
    accentColor: null,
    appName: 'Acme Workspace',
  },
  featureFlags: {
    betaBoards: false,
    advancedReports: false,
    memberInvites: false,
    customBranding: false,
  },
}

const meta = {
  title: 'Organizations/OrganizationSettingsForm',
  component: OrganizationSettingsForm,
  tags: ['autodocs'],
  args: {
    settings,
    onSubmit: fn(),
    isSubmitting: false,
  },
  argTypes: {
    onSubmit: { control: false },
    formError: { control: 'text' },
    notice: { control: 'text' },
    readOnly: { control: 'boolean' },
    readOnlyMessage: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof OrganizationSettingsForm>

export default meta

type Story = StoryObj<typeof meta>

export const Pristine: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/Timezone/i)).toHaveValue(
      'America/New_York',
    )
    await expect(canvas.getByLabelText(/App name/i)).toHaveValue(
      'Acme Workspace',
    )
    await expect(canvas.getByLabelText(/Accent color/i)).toHaveValue('')
    await expect(
      canvas.getByRole('button', { name: 'Save settings' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Discard changes' }),
    ).toBeDisabled()
  },
}

export const Defaults: Story = {
  args: {
    settings: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/Timezone/i)).toHaveValue('UTC')
    await expect(canvas.getByLabelText(/Locale/i)).toHaveValue('en')
    await expect(canvas.getByLabelText(/Logo URL/i)).toHaveValue('')
  },
}

export const SubmitsOnlyChangedFields: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.selectOptions(canvas.getByLabelText(/Locale/i), 'pt-BR')
    await userEvent.type(canvas.getByLabelText(/Accent color/i), '#2a8f66')
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }))

    await expect(args.onSubmit).toHaveBeenCalledWith({
      locale: 'pt-BR',
      branding: { accentColor: '#2a8f66' },
    })
  },
}

export const ClearsBrandingValue: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.clear(canvas.getByLabelText(/Logo URL/i))
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }))

    await expect(args.onSubmit).toHaveBeenCalledWith({
      branding: { logoUrl: null },
    })
  },
}

export const DiscardsChanges: Story = {
  play: async ({ canvas, args }) => {
    const appName = canvas.getByLabelText(/App name/i)
    await userEvent.clear(appName)
    await userEvent.type(appName, 'Renamed Workspace')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Discard changes' }),
    )

    await expect(appName).toHaveValue('Acme Workspace')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldError: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/Primary color/i), 'forest')
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }))

    await expect(
      canvas.getByText('Use a hex color such as #1a5c40.'),
    ).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Save settings' })
    await expect(submit).toBeDisabled()
    await expect(canvas.getByLabelText(/Timezone/i)).toBeDisabled()
    await expect(canvas.getByLabelText(/App name/i)).toBeDisabled()
  },
}

export const ApiError: Story = {
  args: {
    formError: 'You do not have permission to update these settings.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /do not have permission/i,
    )
  },
}

export const Saved: Story = {
  args: {
    notice: 'Settings saved.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Settings saved.',
    )
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText(/Timezone/i)).toBeDisabled()
    await expect(canvas.getByLabelText(/App name/i)).toBeDisabled()
    await expect(canvas.getByLabelText(/Logo URL/i)).toBeDisabled()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      /only admins and owners/i,
    )
    await expect(
      canvas.queryByRole('button', { name: 'Save settings' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Discard changes' }),
    ).toBeNull()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}
