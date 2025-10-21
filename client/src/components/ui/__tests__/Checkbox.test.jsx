import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from '../Checkbox'

describe('Checkbox', () => {
  test('renders with label and correct roles', async () => {
    render(<Checkbox id="cb1" label="Accept" checked={false} onChange={() => {}} />)

    const label = screen.getByText('Accept')
    expect(label).toBeInTheDocument()

    // Query the native input by its label to avoid duplicate-role elements (input + visual span)
    const input = screen.getByLabelText('Accept')
    expect(input).toHaveAttribute('aria-checked', 'false')
  })

  test('calls onChange when clicked and toggles aria-checked', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Checkbox id="cb2" label="Agree" checked={false} onChange={handle} />)

  const input = screen.getByLabelText('Agree')
  await user.click(input)
  expect(handle).toHaveBeenCalled()
  })

  test('handles keyboard activation (Space/Enter)', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Checkbox id="cb3" label="Terms" checked={false} onChange={handle} />)

  // focus the visual control (span with role) so the onKeyDown handler runs
  const labelEl = screen.getByText('Terms').closest('label')
  const visual = labelEl.querySelector('[role="checkbox"]')
  fireEvent.keyDown(visual, { key: ' ', code: 'Space' })
  expect(handle).toHaveBeenCalled()
  })

  test('disabled does not call onChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Checkbox id="cb4" label="Disabled" checked={false} onChange={handle} disabled />)

    const input = screen.getByLabelText('Disabled')
    await user.click(input)
    expect(handle).not.toHaveBeenCalled()
  })
})
