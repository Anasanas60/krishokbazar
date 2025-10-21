import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Radio from '../Radio'

describe('Radio group arrow navigation', () => {
  test('Arrow keys move selection within group and wrap-around', () => {
    const handle = vi.fn()

    render(
      <div>
        <Radio id="rg1" name="group-nav" label="First" checked={true} onChange={handle} />
        <Radio id="rg2" name="group-nav" label="Second" checked={false} onChange={handle} />
        <Radio id="rg3" name="group-nav" label="Third" checked={false} onChange={handle} />
      </div>
    )

    const firstLabel = screen.getByText('First').closest('label')
    const firstVisual = firstLabel.querySelector('[role="radio"]')

    // Press ArrowRight -> should move to Second
    fireEvent.keyDown(firstVisual, { key: 'ArrowRight', code: 'ArrowRight' })
    expect(handle).toHaveBeenCalled()
    const calls = handle.mock.calls
    expect(calls[calls.length - 1][0]).toBe('rg2')

    // Press ArrowRight again -> move to Third
    const secondLabel = screen.getByText('Second').closest('label')
    const secondVisual = secondLabel.querySelector('[role="radio"]')
    fireEvent.keyDown(secondVisual, { key: 'ArrowRight', code: 'ArrowRight' })
    expect(handle).toHaveBeenCalled()
    expect(handle.mock.calls[handle.mock.calls.length - 1][0]).toBe('rg3')

    // Press ArrowRight again -> wrap to First
    const thirdLabel = screen.getByText('Third').closest('label')
    const thirdVisual = thirdLabel.querySelector('[role="radio"]')
    fireEvent.keyDown(thirdVisual, { key: 'ArrowRight', code: 'ArrowRight' })
    expect(handle).toHaveBeenCalled()
    expect(handle.mock.calls[handle.mock.calls.length - 1][0]).toBe('rg1')

    // ArrowLeft from First -> wrap to Third
    fireEvent.keyDown(firstVisual, { key: 'ArrowLeft', code: 'ArrowLeft' })
    expect(handle).toHaveBeenCalled()
    expect(handle.mock.calls[handle.mock.calls.length - 1][0]).toBe('rg3')
  })

  test('Tab moves focus out of group (tabindex behavior)', async () => {
    render(
      <div>
        <Radio id="rg4" name="group-nav-2" label="A" checked={true} onChange={()=>{}} />
        <Radio id="rg5" name="group-nav-2" label="B" checked={false} onChange={()=>{}} />
        <button>Next</button>
      </div>
    )

    const aLabel = screen.getByText('A').closest('label')
    const aVisual = aLabel.querySelector('[role="radio"]')

  aVisual.focus()
  const user = userEvent.setup()
  await user.tab()

    // After tab, focus should move (not equal to the visual element)
    expect(document.activeElement).not.toBe(aVisual)
  })
})
