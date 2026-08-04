import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { Button } from './Button'

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  width: min(100%, 20rem);
`

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving…',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn more',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete workspace',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Invite',
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Continue',
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export const Variants: Story = {
  render: () => (
    <Row>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Row>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Row>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
    </Row>
  ),
}

export const States: Story = {
  render: () => (
    <Row>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </Row>
  ),
}
