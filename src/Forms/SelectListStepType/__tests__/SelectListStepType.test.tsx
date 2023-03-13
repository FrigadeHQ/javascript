import React from 'react'
import { SelectListStepType } from '../SelectListStepType'
import { render, screen } from '@testing-library/react'

describe('SelectListStepType', () => {

  const stepData = {
    props: {
      data: [
        {
          title: 'Select option 1',
          icon: 'data:image/png;base64,xyz'
        },
        {
          title: 'Select option 2',
          icon: 'data:image/png;base64,xyz'
        },
      ]
    }
  }
  
  test('renders options', () => {
    render(<SelectListStepType stepData={stepData} setCanContinue={jest.fn()} appearance={{}} />)

    expect(screen.getByText(stepData.props.data[0].title)).toBeDefined()
    expect(screen.getByText(stepData.props.data[1].title)).toBeDefined()
    expect(screen.getByAltText('select-icon-0')).toBeDefined()
    expect(screen.getByAltText('select-icon-1')).toBeDefined()
  })
})