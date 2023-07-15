import styled from 'styled-components'
import { variant, system } from 'styled-system'

import { Box } from '../Box'

export const textVariants = {
  Display1: {
    fontSize: '5xl',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: '4xl',
  },
  Display2: {
    fontSize: '4xl',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: '3xl',
  },
  H1: {
    fontSize: '3xl',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: '2xl',
  },
  H2: {
    fontSize: '2xl',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: 'xl',
  },
  H3: {
    fontSize: 'xl',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: 'lg',
  },
  H4: {
    fontSize: 'lg',
    fontWeight: 'bold',
    letterSpacing: 'md',
    lineHeight: 'md',
  },
  Body1: {
    fontSize: 'md',
    fontWeight: 'regular',
    letterSpacing: 'md',
    lineHeight: 'md',
  },
  Body2: {
    fontSize: 'sm',
    fontWeight: 'regular',
    letterSpacing: 'md',
    lineHeight: 'md',
  },
  Caption: {
    fontSize: 'xs',
    fontWeight: 'regular',
    letterSpacing: 'md',
    lineHeight: 'sm',
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
    variants: 'components.Text',
  }),
  system({
    fontWeight: {
      property: 'fontWeight',
      scale: 'fontWeights',
    },
  })
)
