import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import PublicLayout from '.'

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size['2xl']};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`

const Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`

const meta = {
  title: 'Layout/PublicLayout',
  component: PublicLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof PublicLayout>

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  args: {
    children: (
      <Panel>
        <div>
          <Title>Sign in</Title>
          <Lead>
            Auth API wiring lands in Phase 1. This shell is the guest
            composition for login and registration.
          </Lead>
        </div>
        <Actions>
          <FormField label="Email" required>
            <Input type="email" placeholder="you@company.com" fullWidth />
          </FormField>
          <FormField label="Password" required>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              fullWidth
            />
          </FormField>
          <Button type="button" fullWidth>
            Sign in
          </Button>
        </Actions>
      </Panel>
    ),
  },
}

export const CreateAccount: Story = {
  args: {
    children: (
      <Panel>
        <div>
          <Title>Create account</Title>
          <Lead>
            Start a workspace for your team. Invitation and org flows land with
            later phases.
          </Lead>
        </div>
        <Actions>
          <FormField label="Full name" required>
            <Input placeholder="Alex Rivera" fullWidth />
          </FormField>
          <FormField label="Work email" required>
            <Input type="email" placeholder="alex@company.com" fullWidth />
          </FormField>
          <FormField
            label="Password"
            required
            hint="At least 8 characters."
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              fullWidth
            />
          </FormField>
          <Button type="button" fullWidth>
            Create account
          </Button>
        </Actions>
      </Panel>
    ),
  },
}

export const EmptyOutlet: Story = {
  args: {
    children: (
      <Panel>
        <Title>Guest content</Title>
        <Lead>Route pages render here via React Router’s outlet.</Lead>
      </Panel>
    ),
  },
}
