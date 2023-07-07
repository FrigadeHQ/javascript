import React from 'react'
import { render, screen } from '@testing-library/react'

import { DefaultAppearance } from '../../../types'
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

  test('Hidden if no selector found', () => {
    function ControlledTooltipHidden() {
      return (
        <div>
          <Tooltips
            completedStepsCount={0}
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
})
