import React from 'react'
import { SelectListStepType } from '../SelectListStepType'
import { render, screen } from '@testing-library/react'
import { mergeAppearanceWithDefault, StepData } from '../../../types'

describe('SelectListStepType', () => {
  const stepData = {
    props: {
      options: [
        {
          title: 'Select option 1',
          icon: 'data:image/png;base64,xyz',
        },
        {
          title: 'Select option 2',
          icon: 'data:image/png;base64,xyz',
        },
      ],
    },
  } as StepData

  test('renders options', () => {
    render(
      <SelectListStepType
        stepData={stepData}
        setCanContinue={jest.fn()}
        appearance={mergeAppearanceWithDefault({})}
        onSaveData={jest.fn()}
        canContinue={false}
      />
    )

    expect(screen.getByText(stepData.props.options[0].title)).toBeDefined()
    expect(screen.getByText(stepData.props.options[1].title)).toBeDefined()
  })
})
