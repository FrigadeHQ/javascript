import React, { FC } from 'react'
import { Appearance, StepData } from '../../../types'
import { CheckBoxRow } from '../../../components/CheckBoxRow'
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
  appearance?: Appearance
}

export const CollapsibleStep: FC<CollapsibleStepProps> = ({
  stepData,
  collapsed,
  onClick,
  primaryColor = '#000000',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  appearance,
}) => {
  const iconStyle = collapsed ? {} : { transform: 'rotate(90deg)' }

  return (
    <StepContainer
      onClick={() => (collapsed ? onClick() : null)}
      data-testid={`step-${stepData.id}`}
      appearance={appearance}
    >
      <StepHeader>
        <HeaderLeft>
          <CheckBoxRow
            value={stepData.complete}
            style={{ width: 'auto', borderTop: 0 }}
            primaryColor={appearance?.theme?.colorPrimary}
          />
          <StepTitle appearance={appearance}>{stepData.title}</StepTitle>
        </HeaderLeft>

        <CollapseChevronContainer onClick={() => onClick()}>
          <Chevron style={{ ...iconStyle, transition: 'transform 0.1s ease-in-out' }} color={appearance?.theme?.colorTextSecondary}/>
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
            <StepSubtitle appearance={appearance}>{stepData.subtitle}</StepSubtitle>
            <MultipleButtonContainer>
              <Button
                title={stepData.primaryButtonTitle ?? 'Continue'}
                onClick={() => onPrimaryButtonClick()}
                style={{ width: 'auto' }}
                appearance={appearance}
              />
              {stepData.secondaryButtonTitle ? (
                <Button
                  secondary
                  title={stepData.secondaryButtonTitle}
                  onClick={() => onSecondaryButtonClick()}
                  style={{ marginLeft: '12px', width: 'auto' }}
                  appearance={appearance}
                />
              ) : null}
            </MultipleButtonContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  )
}
