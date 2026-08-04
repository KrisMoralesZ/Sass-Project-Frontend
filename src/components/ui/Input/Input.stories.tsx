import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import Input from '.'

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
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    placeholder: 'Workspace name',
    size: 'md',
    error: false,
    disabled: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Acme Corp',
  },
}

export const Error: Story = {
  args: {
    error: true,
    defaultValue: 'taken-slug',
    placeholder: 'Slug',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search…',
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: 'Email address',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'current-password',
  },
}

export const Sizes: Story = {
  render: () => (
    <Row>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
    </Row>
  ),
}

export const States: Story = {
  render: () => (
    <Stack>
      <Input placeholder="Default" />
      <Input disabled value="Disabled" />
      <Input error defaultValue="Invalid value" />
    </Stack>
  ),
}
