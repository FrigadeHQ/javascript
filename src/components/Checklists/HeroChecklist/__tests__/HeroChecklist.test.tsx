import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { HeroChecklist } from '../index'

describe('HeroChecklist', () => {
  const handlePrimary = jest.fn()
  const handleSecondary = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  const stepData = {
    title: 'First step content',
    subtitle: 'First step content subtitle',
    cta: 'Mark complete',
    stepName: 'First Step',
    id: 'test',
    complete: false,

    primaryButtonTitle: 'Test Primary',
    secondaryButtonTitle: 'Test Secondary',
    handlePrimaryButtonClick: handlePrimary,
    handleSecondaryButtonClick: handleSecondary,
  }

  const HeroChecklistProps = {
    flowId: 'flow_abc',
    title: 'My Checklist',
    subtitle: 'Hero Checklist for your website',
    steps: [stepData],
    primaryColor: '#0CCCCC',
  }

  test('renders expected content', () => {
    render(<HeroChecklist {...HeroChecklistProps} />)

    expect(screen.getByText(HeroChecklistProps.title)).toBeDefined()
    expect(screen.getByText(HeroChecklistProps.subtitle)).toBeDefined()
  })

  test('handles primary button option', () => {
    render(<HeroChecklist {...HeroChecklistProps} />)

    fireEvent.click(screen.getByText(stepData.primaryButtonTitle))
    expect(handlePrimary).toHaveBeenCalledTimes(1)
    expect(handleSecondary).toHaveBeenCalledTimes(0)
  })

  test('handles secondary button option', () => {
    render(<HeroChecklist {...HeroChecklistProps} />)

    fireEvent.click(screen.getByText(stepData.secondaryButtonTitle))
    expect(handlePrimary).toHaveBeenCalledTimes(0)
    expect(handleSecondary).toHaveBeenCalledTimes(1)
  })
})
