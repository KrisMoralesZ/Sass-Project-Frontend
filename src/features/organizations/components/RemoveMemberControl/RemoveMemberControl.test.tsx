import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import RemoveMemberControl from './index'

function renderControl(
  overrides: Partial<Parameters<typeof RemoveMemberControl>[0]> = {},
) {
  const props = {
    memberName: 'Jane Doe',
    canRemove: true,
    onRemove: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }

  render(<RemoveMemberControl {...props} />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  })

  return props
}

describe('RemoveMemberControl', () => {
  it('renders nothing without manage permission', () => {
    renderControl({ canRemove: false })

    expect(screen.queryByRole('button', { name: 'Remove member' })).toBeNull()
  })

  it('requires confirmation before removing and closes on success', async () => {
    const user = userEvent.setup()
    const props = renderControl()

    await user.click(screen.getByRole('button', { name: 'Remove member' }))
    expect(
      screen.getByRole('dialog', {
        name: 'Remove Jane Doe from this workspace?',
      }),
    ).toBeTruthy()
    expect(props.onRemove).not.toHaveBeenCalled()

    await user.click(
      screen.getAllByRole('button', { name: 'Remove member' })[1],
    )

    await waitFor(() => {
      expect(props.onRemove).toHaveBeenCalledOnce()
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('prevents removing the last owner and explains the backend rule', async () => {
    const user = userEvent.setup()
    const props = renderControl({ isLastOwner: true })

    const button = screen.getByRole('button', { name: 'Remove member' })
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('note').textContent).toContain('at least one owner')

    await user.click(button)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(props.onRemove).not.toHaveBeenCalled()
  })

  it('keeps the dialog open and displays errors when removal fails', async () => {
    const user = userEvent.setup()
    const removeError = new Error(
      'You do not have permission to remove members.',
    )
    const props = renderControl({
      error: removeError,
      onRemove: vi.fn().mockRejectedValue(removeError),
    })

    await user.click(screen.getByRole('button', { name: 'Remove member' }))
    await user.click(
      screen.getAllByRole('button', { name: 'Remove member' })[1],
    )

    await waitFor(() => {
      expect(props.onRemove).toHaveBeenCalledOnce()
    })
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toContain(
      'You do not have permission',
    )
  })

  it('can cancel without submitting', async () => {
    const user = userEvent.setup()
    const props = renderControl()

    await user.click(screen.getByRole('button', { name: 'Remove member' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(props.onRemove).not.toHaveBeenCalled()
  })
})
