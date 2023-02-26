import React from "react"
import  { ChecklistWithGuide } from ".."
import { render, screen } from '@testing-library/react'

describe('ChecklistWithGuide', () => { 

  const testProps = {
    visible: true,
    stepsTitle: 'Custom steps title for guide checklist',
    onClose: jest.fn(),
    steps: []
  }

  test('renders', () => {
    render(<ChecklistWithGuide {...testProps} />)
    expect(screen.getByText(testProps.stepsTitle)).toBeDefined()
  })
})