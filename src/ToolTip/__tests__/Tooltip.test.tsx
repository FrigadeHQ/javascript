import React from 'react'
import { render, screen } from '@testing-library/react'

import { Tooltip } from '../index'

describe('Tooltip', () => {
  const data = [{
    id: 'test',
    complete: false,
    title: 'Test title',
    subtitle: 'Test subtitle',
    cta: 'Next',
    selector: 'test-select-0'
  }]

  test('renders with provided ref div', () => {
    const onDismiss = jest.fn()
    const onComplete = jest.fn()
    const onNext = jest.fn()

    function ControlledTooltip() {
      return (
        <div>
          <Tooltip
            data={data}
            onComplete={onComplete}
            onDismiss={onDismiss}
            onNext={onNext}
          />
          <div id="tooltip-target">
            <p>Some text on screen!</p>
          </div>
        </div>
      )
    }
    render(<ControlledTooltip />)
    expect(screen.getByText(data[0].title)).toBeDefined()
    expect(screen.getByText(data[0].subtitle)).toBeDefined()
  })
})
