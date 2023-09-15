import React from 'react'
import { render, screen } from '@testing-library/react'

import { Guide } from '../index'
import { GuideStepData } from '../Guide'
import { DefaultAppearance } from '../../../types'

describe('Guide', () => {
  const title = 'Test onboarding guide'
  const steps: GuideStepData[] = [
    {
      id: 'workspaces',
      title: 'Manage workspaces',
      subtitle: 'Manage your different workspaces to achieve success with this product.',
      primaryButtonTitle: 'Read guide',
      icon: '📊',
      complete: false,
      currentlyActive: false,
    },
    {
      id: 'labels',
      title: 'Create and review labels',
      icon: '🖍️',
      subtitle:
        'Create and review labels to achieve success with this product. Follow the guide to learn more.',
      primaryButtonTitle: 'Read guide 2',
      complete: false,
      currentlyActive: true,
    },
  ]

  test('renders content', () => {
    render(<Guide appearance={DefaultAppearance} steps={steps} title={title} />)
    expect(screen.getByText(title)).toBeDefined()
    steps.forEach((s: GuideStepData) => {
      expect(screen.getByText(s.icon as string)).toBeDefined()
      expect(screen.getByText(s.title as string)).toBeDefined()
      expect(screen.getByText(s.subtitle as string)).toBeDefined()
      expect(screen.getByText(s.primaryButtonTitle as string)).toBeDefined()
    })
  })
})
