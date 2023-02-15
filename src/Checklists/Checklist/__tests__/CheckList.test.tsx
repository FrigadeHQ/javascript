import React from 'react'
import { render, screen } from '@testing-library/react'
import { Checklist } from '../index'

describe('Checklist', () => {
  const testCheckListProps = {
    title: 'Checklist',
    subtitle: 'Steps for user to take',
    steps: [
      {
        text: 'Step 1',
        complete: false,
      },
      {
        text: 'Step 2',
        complete: false,
      },
    ],
  }

  test('renders', async () => {
    render(<Checklist {...testCheckListProps} />)
    expect(screen.getByText(testCheckListProps.title)).toBeDefined()
    expect(screen.getByText(testCheckListProps.subtitle)).toBeDefined()

    expect(screen.getByText(testCheckListProps.steps[0].text)).toBeDefined()
    expect(screen.getByText(testCheckListProps.steps[1].text)).toBeDefined()

    const items = await screen.getAllByRole('checkbox')
    expect(items.length).toBe(2)

    const listItems = await screen.getAllByRole('listitem')
    expect(listItems.length).toBe(2)
  })
})
