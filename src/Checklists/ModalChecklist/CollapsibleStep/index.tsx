import React, { FC } from 'react'
import { StepData } from '../../../types'
import { CheckBox } from '../../../components/CheckBox'
import { Chevron } from '../../../components/Icons/Chevron'
import { Button } from '../../../components/Button'

import {
  CollapseChevronContainer,
  ExpandedContentContainer,
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
    <StepContainer>
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

      <ExpandedContentContainer open={!collapsed}>
        <StepSubtitle>{stepData.subtitle}</StepSubtitle>

        <Button
          title={stepData.primaryButtonTitle ?? 'Continue'}
          onClick={() => onComplete()}
          style={{ backgroundColor: primaryColor, borderColor: primaryColor, width: 'auto' }}
        />
      </ExpandedContentContainer>
    </StepContainer>
  )
}
