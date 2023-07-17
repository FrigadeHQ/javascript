import * as React from 'react'
import { BoxProps } from '../Box'
import { StyledCard } from './Card.styles'

export interface CardProps extends BoxProps {
  dismissible?: boolean
}

export const Card: React.FC<CardProps> = ({ children, dismissible = false }) => {
  return (
    <StyledCard p="5" bg="white" borderRadius="md" boxShadow="md">
      {dismissible && 'X'}
      {children}
    </StyledCard>
  )
}
