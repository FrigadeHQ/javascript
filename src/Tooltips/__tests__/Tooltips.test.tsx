import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { DefaultAppearance, StepData } from '../../types'
import { Tooltips } from '../index'

// TODO: @wbert Mock position bounds to properly test tooltip 
describe.skip('Tooltip', () => {
  const data = [
    {
      id: 'test-0',
      complete: false,
      title: 'Test title',
      subtitle: 'Test subtitle',
      cta: 'Next',
      selector: '#test-select-0',
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

  function ControlledTooltip() {
    return (
      <div>
        <Tooltips
          steps={data}
          onComplete={onComplete}
          onDismiss={onDismiss}
          appearance={DefaultAppearance}
        />
        <div id="test-select-0">
          <p>Some text on screen!</p>
        </div>
      </div>
    )
  }

  test('renders with provided selector found', async () => {
    render(<ControlledTooltip />)
    expect(screen.getByText(data[0].title)).toBeDefined()
    expect(screen.getByText(data[0].subtitle)).toBeDefined()
  })

  test('Hidden if no selector found', () => {
    function ControlledTooltipHidden() {
      return (
        <div>
          <Tooltips
            steps={data}
            onComplete={onComplete}
            onDismiss={onDismiss}
            appearance={DefaultAppearance}
          />
          <div id="tooltip-err-target">
            <p>Some text on screen!</p>
          </div>
        </div>
      )
    }
    render(<ControlledTooltipHidden />)
    expect(screen.queryByText(data[0].title)).toBeNull()
    expect(screen.queryByText(data[0].subtitle)).toBeNull()
  })

  test('handles secondary action', () => {
    render(<ControlledTooltip />)

    fireEvent.click(screen.getByText(data[0].secondaryButtonTitle ?? 'Skip'))
    expect(data[0].handleSecondaryButtonClick).toHaveBeenCalledTimes(1)
  })

  test('renders custom StepContent', () => {
    const CustomStepContent = () => (
      <div data-testid="test-div">
        <p>This is custom content</p>
        <button>Custom primary</button>
      </div>
    )

    const customStepData = [
      {
        id: 'test-0',
        complete: false,
        selector: '#test-select-0',
        handlePrimaryButtonClick: jest.fn(),
      } as unknown as StepData,
    ]

    const customSteps = new Map()
    customSteps['default'] = CustomStepContent

    function ControlledTooltipCustom() {
      return (
        <div>
          <Tooltips
            steps={customStepData}
            onComplete={onComplete}
            onDismiss={onDismiss}
            customStepTypes={customSteps}
            appearance={DefaultAppearance}
          />
          <div id="test-select-0">
            <p>Some text on screen!</p>
          </div>
        </div>
      )
    }

    render(<ControlledTooltipCustom />)
    expect(screen.getByTestId('test-div')).toBeDefined()
    expect(screen.getByText('This is custom content')).toBeDefined()
  })
})
