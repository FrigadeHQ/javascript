import React, { FC } from 'react'
import { StepData } from '../../../types'
import { CheckBoxRow } from '../../../components/CheckBoxRow'
import { Chevron } from '../../../components/Icons/Chevron'
import { Button } from '../../../components/Button'
import { AnimatePresence, motion } from 'framer-motion'

import {
  CollapseChevronContainer,
  HeaderLeft,
  StepContainer,
  StepHeader,
  StepSubtitle,
  StepTitle,
} from './styled'

interface CollapsibleStepProps {
  stepData: StepData
  collapsed: boolean
  onClick: () => void
  onComplete: () => void
  primaryColor?: string
}

export const CollapsibleStep: FC<CollapsibleStepProps> = ({
  stepData,
  collapsed,
  onClick,
  primaryColor = '#000000',
  onComplete,
}) => {
  const iconStyle = collapsed ? {} : { transform: 'rotate(90deg)' }

  return (
    <StepContainer onClick={() => collapsed ? onClick() : null} data-testid={`step-${stepData.id}`}>
      <StepHeader>
        <HeaderLeft>
          <CheckBoxRow
            value={stepData.complete}
            style={{ width: 'auto', borderTop: 0 }}
            primaryColor={primaryColor}
          />
          <StepTitle>{stepData.title}</StepTitle>
        </HeaderLeft>

        <CollapseChevronContainer onClick={() => onClick()}>
          <Chevron style={{ ...iconStyle, transition: 'transform 0.1s ease-in-out' }} />
        </CollapseChevronContainer>
      </StepHeader>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 1, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 1, height: 0 }}
            key={stepData.id}
            style={{ overflow: 'hidden' }}
          >
            <StepSubtitle>{stepData.subtitle}</StepSubtitle>
            <Button
              title={stepData.primaryButtonTitle ?? 'Continue'}
              onClick={() => onComplete()}
              style={{ backgroundColor: primaryColor, borderColor: primaryColor, width: 'auto' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  )
}
