import React from 'react'
import { render, screen } from '@testing-library/react'
import { HeroChecklist } from '../index'

describe('HeroChecklist', () => {
  const stepData = {
    title: 'First step content',
    subtitle: 'First step content subtitle',
    cta: 'Mark complete',
    stepName: 'First Step',
    id: 'test',
    complete: false,
  }

  const HeroChecklistProps = {
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
})
