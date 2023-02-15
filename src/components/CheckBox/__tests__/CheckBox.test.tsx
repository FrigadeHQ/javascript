import React from 'react'
import { CheckBox } from '../index'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

describe('CheckBox', () => {
  const testCheckboxProps = {
    label: 'Checklist item',
    value: false,
    index: 0,
    length: 1,
  }

  test('should renders expected properties', () => {
    render(<CheckBox {...testCheckboxProps} />)
    expect(screen.getByText(testCheckboxProps.label)).toBeDefined()
  })
})
