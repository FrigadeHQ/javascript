import styled from 'styled-components'
import { variant, system } from 'styled-system'
import { tokens } from '../../shared/theme'

import { Box } from '../Box'

export const textVariantStyles = {
  Display1: {
    fontSize: '48px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(48px * .02)',
    lineHeight: '60px',
  },
  Display2: {
    fontSize: '36px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(36px * .02)',
    lineHeight: '46px',
  },
  H1: {
    fontSize: '30px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(30px * .02)',
    lineHeight: '38px',
  },
  H2: {
    fontSize: '24px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(24px * .02)',
    lineHeight: '30px',
  },
  H3: {
    fontSize: '20px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(20px * .02)',
    lineHeight: '26px',
  },
  H4: {
    fontSize: '18px',
    fontWeight: tokens.fontWeights.bold,
    letterSpacing: 'calc(18px * .02)',
    lineHeight: '24px',
  },
  Body1: {
    fontSize: '16px',
    fontWeight: tokens.fontWeights.regular,
    letterSpacing: 'calc(16px * .02)',
    lineHeight: '24px',
  },
  Body2: {
    fontSize: '14px',
    fontWeight: tokens.fontWeights.regular,
    letterSpacing: 'calc(14px * .02)',
    lineHeight: '22px',
  },
  Caption: {
    fontSize: '12px',
    fontWeight: tokens.fontWeights.regular,
    letterSpacing: 'calc(12px * .02)',
    lineHeight: '18px',
  },
} as const

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
}

export const StyledText = styled(Box)(
  variant({
    scale: 'components.Text',
    variants: textVariantStyles,
  }),
  system({
    fontWeight: {
      property: 'fontWeight',
      scale: 'fontWeights',
    },
  })
)
