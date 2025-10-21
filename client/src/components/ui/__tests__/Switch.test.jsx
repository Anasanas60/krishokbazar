import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Switch from '../Switch'

describe('Switch', () => {
  test('renders with role switch and reflects checked', () => {
    render(<Switch id="s1" checked={false} onChange={() => {}} label="Notify" />)
    const roleEl = screen.getByRole('switch')
    expect(roleEl).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByText('Notify')).toBeInTheDocument()
  })

  test('toggle via click calls onChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Switch id="s2" checked={false} onChange={handle} label="Notify2" />)

    const input = screen.getByLabelText('Notify2')
    await user.click(input)
    expect(handle).toHaveBeenCalled()
  })

  test('keyboard toggles via Space', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Switch id="s3" checked={false} onChange={handle} label="Notify3" />)

    const labelEl = screen.getByText('Notify3').closest('label')
    const visual = labelEl.querySelector('[role="switch"]')
    fireEvent.keyDown(visual, { key: ' ', code: 'Space' })
    expect(handle).toHaveBeenCalled()
  })
})
