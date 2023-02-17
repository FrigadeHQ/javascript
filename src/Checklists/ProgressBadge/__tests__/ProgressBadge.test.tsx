import React from 'react'
import { ProgressBadge } from '..'
import { render, screen, fireEvent } from '@testing-library/react'

describe('ChecklistProgressBadge', () => {
  const checklistProgressProps = {
    title: 'Test Checklist',
    onClick: jest.fn(),
    count: 2,
    total: 10,
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