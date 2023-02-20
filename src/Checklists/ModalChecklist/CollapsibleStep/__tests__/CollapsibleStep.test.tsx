import React from 'react'
import { CollapsibleStep } from ".."
import { fireEvent, render, screen} from '@testing-library/react'

describe('CollapsibleStep', () => {

  const onClick = jest.fn()

  const stepProps = {
    stepData: {
      id: 'test',
      complete: false
    },
    collapsed: true,
    onClick: onClick,
    onComplete: jest.fn()
  }

  test('handles on click on entire step', () => {
    render(<CollapsibleStep {...stepProps}/>)
    fireEvent.click(screen.getByTestId('step-test'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})