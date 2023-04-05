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
import { sanitize } from '../../../shared/sanitizer'
import { getClassName } from '../../../shared/appearance'

interface CollapsibleStepProps {
  stepData: StepData
  collapsed: boolean
  onClick: () => void
  onSecondaryButtonClick: () => void
  onPrimaryButtonClick: () => void
  appearance?: Appearance
}

export const CollapsibleStep: FC<CollapsibleStepProps> = ({
  stepData,
  collapsed,
  onClick,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  appearance,
}) => {
  const iconStyle = collapsed ? {} : { transform: 'rotate(90deg)' }

  return (
    <StepContainer
      onClick={() => (collapsed ? onClick() : null)}
      data-testid={`step-${stepData.id}`}
      className={getClassName('checklistStepContainer', appearance)}
      appearance={appearance}
    >
      <StepHeader className={getClassName('stepHeader', appearance)}>
        <HeaderLeft>
          <CheckBoxRow
            value={stepData.complete}
            style={{ width: 'auto', borderTop: 0 }}
            primaryColor={appearance?.theme?.colorPrimary}
            appearance={appearance}
          />
          <StepTitle
            appearance={appearance}
            className={getClassName('stepTitle', appearance)}
            dangerouslySetInnerHTML={sanitize(stepData.title)}
          />
        </HeaderLeft>

        <CollapseChevronContainer
          className={getClassName('stepChevronContainer', appearance)}
          onClick={() => onClick()}
        >
          <Chevron
            style={{ ...iconStyle, transition: 'transform 0.1s ease-in-out' }}
            color={appearance?.theme?.colorTextSecondary}
          />
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
            <StepSubtitle
              className={getClassName('stepSubtitle', appearance)}
              appearance={appearance}
              dangerouslySetInnerHTML={sanitize(stepData.subtitle)}
            />
            <MultipleButtonContainer className={getClassName('checklistCTAContainer', appearance)}>
              {stepData.secondaryButtonTitle ? (
                <Button
                  secondary
                  title={stepData.secondaryButtonTitle}
                  onClick={() => onSecondaryButtonClick()}
                  appearance={appearance}
                />
              ) : null}
              <Button
                title={stepData.primaryButtonTitle ?? 'Continue'}
                onClick={() => onPrimaryButtonClick()}
                appearance={appearance}
              />
            </MultipleButtonContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  )
}
