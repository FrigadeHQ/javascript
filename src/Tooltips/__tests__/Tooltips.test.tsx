import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { StepData } from '../../types'
import { Tooltips } from '../index'

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
      handleSecondaryButtonClick: jest.fn(),
    },
    {
      id: 'test-1',
      complete: false,
      title: 'Test title step 2',
      subtitle: 'Test subtitle step 2',
      cta: 'Next',
      selector: 'test-select-1',
      primaryButtonTitle: 'Complete',
    },
  ]

  const onDismiss = jest.fn()
  const onComplete = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('renders with provided selector found', () => {
    function ControlledTooltip() {
      return (
        <div>
          <Tooltips steps={data} onComplete={onComplete} onDismiss={onDismiss} />
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

  test('handles secondary action', () => {
    render(<Tooltips steps={data} onComplete={onComplete} onDismiss={onDismiss} />)

    fireEvent.click(screen.getByText(data[0].secondaryButtonTitle ?? 'Skip'))
    expect(data[0].handleSecondaryButtonClick).toHaveBeenCalledTimes(1)
  })

  test('handles dismiss', () => {
    render(<Tooltips steps={data} onComplete={onComplete} onDismiss={onDismiss} />)

    fireEvent.click(screen.getByTestId('tooltip-dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test.only('renders custom StepContent', () => {

    const CustomStepContent = () => (
      <div data-testid='test-div'>
        <p>This is custom content</p>
        <button>Custom primary</button>
      </div>
    )

    const customStepData = [
      {
        id: 'test-0',
        complete: false,
        selector: 'test-select-0',
        handlePrimaryButtonClick: jest.fn(),
      } as unknown as StepData,
    ]

    const customSteps = new Map()
    customSteps['default'] = CustomStepContent

    render(<Tooltips steps={customStepData} onComplete={onComplete} onDismiss={onDismiss} customStepTypes={customSteps} />)
    expect(screen.getByTestId('test-div')).toBeDefined()
    expect(screen.getByText('This is custom content')).toBeDefined()
  })
})
