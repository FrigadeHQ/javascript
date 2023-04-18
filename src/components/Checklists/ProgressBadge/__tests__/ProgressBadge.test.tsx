import React from 'react'
import { ProgressBadge } from '../index'
import { fireEvent, render, screen } from '@testing-library/react'
import { DefaultAppearance } from '../../../../types'

describe('ChecklistProgressBadge', () => {
  const checklistProgressProps = {
    title: 'Test Checklist',
    onClick: jest.fn(),
    count: 2,
    total: 10,
    appearance: DefaultAppearance,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('renders', () => {
    render(<ProgressBadge {...checklistProgressProps} />)
    expect(screen.getByText(checklistProgressProps.title)).toBeDefined()
    expect(screen.getByText('20%')).toBeDefined()
  })

  test('calls onClick on clicking', () => {
    render(<ProgressBadge {...checklistProgressProps} />)
    fireEvent.click(screen.getByText(checklistProgressProps.title))
    expect(checklistProgressProps.onClick).toHaveBeenCalledTimes(1)
  })
})
