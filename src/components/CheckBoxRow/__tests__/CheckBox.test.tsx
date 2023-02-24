import React from 'react'
import { CheckBoxRow } from '../index'
import { render, screen } from '@testing-library/react'

describe('CheckBox', () => {
  const testCheckboxProps = {
    label: 'Checklist item',
    value: false,
    index: 0,
    length: 1,
  }

  test('should renders expected properties', () => {
    render(<CheckBoxRow {...testCheckboxProps} />)
    expect(screen.getByText(testCheckboxProps.label)).toBeDefined()
    expect(screen.getByRole('checkbox')).toBeDefined()
  })
})
