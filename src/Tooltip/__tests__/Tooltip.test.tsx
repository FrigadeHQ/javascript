import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Tooltip } from '../index'
import { StepData } from '../../types'

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
      handleSecondaryCTAClick: jest.fn()
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

  test('handles onNext and onComplete', () => {
    render(<Tooltip data={data} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)

    fireEvent.click(screen.getByText(data[0].primaryButtonTitle))
    expect(onNext).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText(data[1].primaryButtonTitle))
    expect(onComplete).toHaveBeenCalledTimes(1);
  })

  test('handles secondary action', () => {
    render(<Tooltip data={data} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)

    fireEvent.click(screen.getByText(data[0].secondaryButtonTitle ?? 'Skip'))
    // Skipping does not call the onNext callback: but this behavior may be TBD
    expect(onNext).toHaveBeenCalledTimes(0)
    expect(data[0].handleSecondaryCTAClick).toHaveBeenCalledTimes(1)
  })

  test('handles dismiss', () => {
    render(<Tooltip data={data} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)

    fireEvent.click(screen.getByTestId('tooltip-dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1);
  })

  test('renders custom StepContent', () => {

    const CustomStepContent = ({ stepData }: { stepData: StepData}) => (
      <div data-testid='test-div'>
        <p>This is custom content</p>
        <button onClick={stepData.handleCTAClick}>Custom primary</button>
      </div>
    )

    const customStepData = [
      {
        id: 'test-0',
        complete: false,
        selector: 'test-select-0',
        StepContent: CustomStepContent,
        handleCTAClick: jest.fn()
      } as unknown as StepData,
    ]

    render(<Tooltip data={customStepData} onComplete={onComplete} onDismiss={onDismiss} onNext={onNext} />)
    expect(screen.getByTestId('test-div')).toBeDefined()
    expect(screen.getByText('This is custom content')).toBeDefined()
    fireEvent.click(screen.getByText('Custom primary'))
    expect(customStepData[0].handleCTAClick).toHaveBeenCalledTimes(1)
  })
})
