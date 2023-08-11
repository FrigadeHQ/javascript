import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar', () => {
  const progressBarProps = {
    count: 2,
    total: 10,
  }

  describe('compact', () => {
    test('renders as expected', () => {
      render(<ProgressBar {...progressBarProps} display="compact" />)
    })
    // expect(screen.getByText('20%')).toBeDefined();
  })
  describe('percent', () => {
    test('renders as expected', () => {
      render(<ProgressBar {...progressBarProps} display="percent" />)
      expect(screen.getByText('20% complete')).toBeDefined()
    })
  })
  describe('count', () => {
    test('renders as expected', () => {
      render(<ProgressBar {...progressBarProps} display="count" />)
      expect(screen.getByText('2/10')).toBeDefined()
    })
  })
})
