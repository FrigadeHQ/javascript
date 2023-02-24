import React, { FC } from 'react'
import { StepData } from '../../../types'
import { CheckBox } from '../../../components/CheckBox'
import { Chevron } from '../../../components/Icons/Chevron'
import { Button, MultipleButtonContainer } from '../../../components/Button'
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
  onSecondaryButtonClick: () => void
  onPrimaryButtonClick: () => void
  primaryColor?: string
}

export const CollapsibleStep: FC<CollapsibleStepProps> = ({
  stepData,
  collapsed,
  onClick,
  primaryColor = '#000000',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}) => {
  const iconStyle = collapsed ? {} : { transform: 'rotate(90deg)' }

  return (
    <StepContainer
      onClick={() => (collapsed ? onClick() : null)}
      data-testid={`step-${stepData.id}`}
    >
      <StepHeader>
        <HeaderLeft>
          <CheckBox
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
            <MultipleButtonContainer>
              <Button
                title={stepData.primaryButtonTitle ?? 'Continue'}
                onClick={() => onPrimaryButtonClick()}
                style={{ backgroundColor: primaryColor, borderColor: primaryColor, width: 'auto' }}
              />
              {stepData.secondaryButtonTitle ? (
                <Button
                  title={stepData.secondaryButtonTitle}
                  onClick={() => onSecondaryButtonClick()}
                  textStyle={{ color: primaryColor }}
                  style={{ borderColor: primaryColor, width: 'auto', backgroundColor: '#FFFFFF' }}
                />
              ) : null}
            </MultipleButtonContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  )
}
