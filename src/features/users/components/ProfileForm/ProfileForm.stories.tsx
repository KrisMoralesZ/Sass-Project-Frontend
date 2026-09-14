import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import styled from 'styled-components'
import Toast from '@/components/ui/Toast'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import type { UserProfile } from '../../api/user-api.types'
import ProfileForm from '.'

const Frame = styled.div`
  width: 100%;
  max-width: 46rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
`

const profile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  email: 'owner@acme.local',
  displayName: 'Jane Owner',
  avatarUrl: 'https://cdn.example.com/avatars/jane.png',
  preferences: {
    timezone: 'America/New_York',
    locale: 'en',
    theme: 'system',
    notifications: { email: true, inApp: true, marketing: false },
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
}

const meta = {
  title: 'Users/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  args: {
    profile,
    email: profile.email,
    onSubmit: fn(),
    isSubmitting: false,
  },
  argTypes: {
    onSubmit: { control: false },
    apiError: { control: false },
    formError: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof ProfileForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/^Email$/i)).toHaveTextContent(
      'owner@acme.local',
    )
    await expect(canvas.getByLabelText(/Display name/i)).toHaveValue(
      'Jane Owner',
    )
    await expect(canvas.getByLabelText(/Avatar URL/i)).toHaveValue(
      'https://cdn.example.com/avatars/jane.png',
    )
    await expect(canvas.getByLabelText(/Timezone/i)).toHaveValue(
      'America/New_York',
    )
    await expect(canvas.getByLabelText(/Locale/i)).toHaveValue('en')
    await expect(canvas.getByLabelText(/Theme/i)).toHaveValue('system')
    await expect(
      canvas.getByRole('button', { name: 'Save profile' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Discard changes' }),
    ).toBeDisabled()
  },
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Save profile' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByLabelText(/Display name/i)).toBeDisabled()
    await expect(canvas.getByLabelText(/Theme/i)).toBeDisabled()
  },
}

export const FieldError: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.clear(canvas.getByLabelText(/Avatar URL/i))
    await userEvent.type(canvas.getByLabelText(/Avatar URL/i), 'not-a-url')
    await userEvent.click(canvas.getByRole('button', { name: 'Save profile' }))

    await expect(
      canvas.getByText('Enter an absolute http(s) URL.'),
    ).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ApiValidation: Story = {
  args: {
    apiError: new ApiError({
      code: ErrorCode.VALIDATION_FAILED,
      statusCode: 400,
      message: [
        'displayName must be shorter than or equal to 120 characters',
        'preferences.theme must be one of the following values: system, light, dark',
      ],
    }),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Display name must be 120 characters or fewer.'),
    ).toBeVisible()
    await expect(canvas.getByText('Choose a valid theme.')).toBeVisible()
    await expect(canvas.queryByText(/displayName must be shorter/i)).toBeNull()

    await userEvent.type(canvas.getByLabelText(/Display name/i), ' Updated')
    await expect(
      canvas.queryByText('Display name must be 120 characters or fewer.'),
    ).toBeNull()
    await expect(canvas.getByText('Choose a valid theme.')).toBeVisible()
  },
}

export const Saved: Story = {
  render: (args) => (
    <>
      <ProfileForm {...args} />
      <Toast
        open
        onClose={fn()}
        duration={null}
        variant="success"
        title="Profile saved"
      >
        Your profile preferences were updated.
      </Toast>
    </>
  ),
  play: async () => {
    const toast = await screen.findByRole('status')
    await waitFor(() => expect(toast).toBeVisible())
    await expect(toast).toHaveTextContent('Profile saved')
    await expect(toast).toHaveTextContent(
      'Your profile preferences were updated.',
    )
  },
}
