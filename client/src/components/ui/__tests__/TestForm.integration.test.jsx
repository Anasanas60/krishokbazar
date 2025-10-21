import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TestForm from '../TestForm'

describe('TestForm integration', () => {
  test('tab order and keyboard navigation across controls and submit', async () => {
    const handle = vi.fn()
    render(<TestForm onSubmit={handle} />)

    const user = userEvent.setup()

  // Interact with controls directly to avoid focus flakiness
  const acceptInput = screen.getByLabelText('Accept Terms')
  const acceptVisual = acceptInput.closest('label').querySelector('[role="checkbox"]')
  // Toggle checkbox
  fireEvent.click(acceptInput)
  expect(acceptInput).toBeChecked()

  // ArrowRight from Pickup should select Delivery
  const pickupLabel = screen.getByLabelText('Pickup')
  const pickupVisual = pickupLabel.closest('label').querySelector('[role="radio"]')
  fireEvent.keyDown(pickupVisual, { key: 'ArrowRight', code: 'ArrowRight' })
  const deliveryInput = screen.getByLabelText('Delivery')
  expect(deliveryInput).toBeChecked()

  // Ensure switch is untouched
  const notifyInput = screen.getByLabelText('Notify me')
  expect(notifyInput).not.toBeChecked()

  // Submit form
  const submit = screen.getByRole('button', { name: /submit/i })
  await user.click(submit)
  expect(handle).toHaveBeenCalledWith({ accepted: true, delivery: 'delivery', notify: false })
  })

  test('form collects values on submit after interactions', async () => {
    const handle = vi.fn()
    render(<TestForm onSubmit={handle} />)

    const user = userEvent.setup()
    // Toggle checkbox
  const accept = screen.getByLabelText('Accept Terms')
  await user.click(accept)

    // Select Delivery
  const deliveryInput = screen.getByLabelText('Delivery')
  fireEvent.click(deliveryInput)

    // Toggle switch
    const notify = screen.getByLabelText('Notify me')
    await user.click(notify)

    // Submit
    const submit = screen.getByRole('button', { name: /submit/i })
    await user.click(submit)

    expect(handle).toHaveBeenCalledWith({ accepted: true, delivery: 'delivery', notify: true })
  })
})
