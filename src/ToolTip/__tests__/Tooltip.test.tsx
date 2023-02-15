import React from 'react'
import { render, screen } from '@testing-library/react'

import { Tooltip } from '../index'

describe('Tooltip', () => {
  const data = {
    title: 'Test title',
    subtitle: 'Test subtitle',
    cta: 'Next',
  }

  test('renders with provided ref div', () => {
    const onDismiss = jest.fn()
    const onComplete = jest.fn()
    const onNext = jest.fn()

    function ControlledTooltip() {
      const testRef = {
        current: {
          getBoundingClientRect: jest.fn(() => ({ x: 100, y: 100, width: 200, height: 200 })),
        },
      }
      return (
        <div>
          <Tooltip
            ref={testRef}
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
    expect(screen.getByText(data.title)).toBeDefined()
    expect(screen.getByText(data.subtitle)).toBeDefined()
  })
})
