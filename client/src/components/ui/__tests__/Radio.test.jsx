import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Radio from '../Radio'

describe('Radio', () => {
  test('renders and has label', () => {
    render(<Radio id="r1" name="group1" label="Option" checked={false} onChange={() => {}} />)
    const input = screen.getByLabelText('Option')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'radio')
  })

  test('keyboard activation triggers onChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Radio id="r2" name="g2" label="Opt2" checked={false} onChange={handle} />)

  const labelEl = screen.getByText('Opt2').closest('label')
  const visual = labelEl.querySelector('[role="radio"]')
  fireEvent.keyDown(visual, { key: 'Enter', code: 'Enter' })
  expect(handle).toHaveBeenCalled()
  })

  test('clicking triggers onChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Radio id="r3" name="g3" label="Opt3" checked={false} onChange={handle} />)

    const input = screen.getByLabelText('Opt3')
    await user.click(input)
    expect(handle).toHaveBeenCalled()
  })
})
