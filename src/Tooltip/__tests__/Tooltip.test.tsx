import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Tooltip } from '../index'

describe('Tooltip', () => {
  const data = [
    {
      id: 'test-0',
      complete: false,
      title: 'Test title',
      subtitle: 'Test subtitle',
      cta: 'Next',
      selector: 'test-select-0',
      primaryButtonTitle: 'Next',
      secondaryButtonTitle: 'Skip',
    },
    {
      id: 'test-1',
      complete: false,
      title: 'Test title step 2',
      subtitle: 'Test subtitle step 2',
      cta: 'Next',
      selector: 'test-select-1',
      primaryButtonTitle: 'Complete',
    }
  ]

  const onDismiss = jest.fn()
  const onComplete = jest.fn()
  const onNext = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('renders with provided selector found', () => {

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

  test('handles actions', () => {
    render(<Tooltip data={data} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)

    fireEvent.click(screen.getByText(data[0].primaryButtonTitle))
    expect(onNext).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText(data[1].primaryButtonTitle))
    expect(onComplete).toHaveBeenCalledTimes(1);
  })

  test('handles dismiss', () => {
    render(<Tooltip data={data} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)

    fireEvent.click(screen.getByTestId('tooltip-dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1);
  })

})
