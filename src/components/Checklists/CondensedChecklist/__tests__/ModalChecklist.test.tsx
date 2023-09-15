import React from 'react'
import CondensedChecklist from '../CondensedChecklist'
import { render } from '@testing-library/react'
import { DefaultAppearance } from '../../../../types'

describe('ModalChecklist', () => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

  afterAll(() => {
    jest.restoreAllMocks()
  })

  const modalChecklistProps = {
    appearance: DefaultAppearance,
    title: 'Test Checklist',
    subtitle: 'More content for test checklist',
    onClose: jest.fn(),
    visible: true,
    steps: [
      {
        id: 'welcome',
        stepName: 'Welcome to Frigade',
        title: 'Check out our interactive demo.',
        subtitle:
          'We built Frigade to help developers build high-quality onboarding and education. In fact, this entire demo was built with Frigade.',
        cta: 'Mark complete',
        image: '/img/frigade-image.webp',
        complete: false,
        currentlyActive: true,
      },
      {
        id: 'use-cases',
        stepName: 'Use cases',
        title: 'If you can think it, you can build it.',
        subtitle:
          'From onboarding forms to interactive product tours, Frigade will handle the heavy lifting of building onboarding.',
        cta: 'See use cases',
        url: '/#use-cases',
        image: '/img/usecase-image.webp',
        type: 'checklistItem',
        complete: false,
        currentlyActive: false,
      },
    ],
  }

  test('renders', () => {
    render(<CondensedChecklist {...modalChecklistProps} />)
  })
})
