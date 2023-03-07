import React, { FC, useState } from 'react'

import styled from 'styled-components'
import { StepChecklistItem } from './StepChecklistItem'
import { ProgressBar } from '../Checklist/Progress'
import { DefaultFrigadeFlowProps, mergeAppearanceWithDefault, StepData } from '../../types'
import {
  HERO_STEP_CONTENT_TYPE,
  HeroStepContent,
} from '../../components/step-content/HeroStepContent'
import { StepContentProps } from '../../FrigadeForm/types'
import { VIDEO_CAROUSEL_TYPE, VideoCarousel } from '../../components/step-content/VideoCarousel'

export interface HeroChecklistProps extends DefaultFrigadeFlowProps {
  title?: string
  subtitle?: string
  /**
   * @deprecated Use `appearance` instead
   */
  primaryColor?: string
  steps?: StepData[]

  /**
   * @deprecated use onStepCompletion instead
   */
  onCompleteStep?: (index: number, stepData: StepData) => void

  // Optional props
  selectedStep?: number
  setSelectedStep?: (index: number) => void

  // Map from string to function with StepData returning React.ReactNode
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>
}

const HeroChecklistContainer = styled.div<{ appearance }>`
  display: flex;
  flex-direction: row;
  min-width: 1000px;
  margin: 40px 40px 40px 40px;
  background: ${(props) => props.appearance?.theme.colorBackground};
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
`

const HeroChecklistTitle = styled.p<{ apperance }>`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.appearance?.theme?.colorText};
`

const HeroChecklistSubtitle = styled.p`
  font-size: 15px;
  line-height: 20px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary ?? '#4d4d4d'};
  margin: 10px 0px 0px 0px;
`

const ChecklistHeader = styled.div`
  padding-bottom: 16px;
`

const ChecklistStepsContainer = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`

const Divider = styled.div`
  width: 1px;
  margin: 40px;
  background: #e6e6e6;
`

const HeroChecklistStepContentContainer = styled.div`
  flex: 2;
  padding: 2rem;
`

const HeroChecklist: FC<HeroChecklistProps> = ({
  title,
  subtitle,
  steps = [],
  primaryColor,
  style = {},
  selectedStep,
  setSelectedStep,
  className = '',
  customStepTypes = new Map(),
  appearance,
}) => {
  appearance = mergeAppearanceWithDefault(appearance)

  // TODO: Remove once primary and secondary colors are deprecated + removed
  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }

  const DEFAULT_CUSTOM_STEP_TYPES = new Map([
    [HERO_STEP_CONTENT_TYPE, HeroStepContent],
    [VIDEO_CAROUSEL_TYPE, VideoCarousel],
  ])

  const mergedCustomStepTypes = new Map<string, FC<StepContentProps>>([
    ...DEFAULT_CUSTOM_STEP_TYPES,
    ...customStepTypes,
  ])

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal
  const setSelectedStepValue = setSelectedStep ?? setSelectedStepInternal

  const completeCount = steps.filter((s) => s.complete === true).length

  const StepContent = () => {
    if (
      !steps[selectedStepValue]?.type ||
      !mergedCustomStepTypes.has(steps[selectedStepValue].type)
    ) {
      return mergedCustomStepTypes.get(HERO_STEP_CONTENT_TYPE)({
        stepData: steps[selectedStepValue],
        appearance: appearance,
      })
    }
    return mergedCustomStepTypes.get(steps[selectedStepValue].type)({
      stepData: steps[selectedStepValue],
      appearance: appearance,
    })
  }

  return (
    <HeroChecklistContainer style={style} className={className} appearance={appearance}>
      <ChecklistHeader style={{ flex: 1 }}>
        <ChecklistHeader style={{ padding: '30px 0px 30px 30px', borderBottom: 'none' }}>
          <HeroChecklistTitle appearance={appearance}>{title}</HeroChecklistTitle>
          <HeroChecklistSubtitle appearance={appearance}>{subtitle}</HeroChecklistSubtitle>
          <ProgressBar
            total={steps.length}
            count={completeCount}
            fillColor={appearance.theme.colorPrimary}
            style={{ marginTop: '24px' }}
            appearance={appearance}
          />
        </ChecklistHeader>
        <ChecklistStepsContainer>
          {steps.map((s: StepData, idx: number) => {
            return (
              <StepChecklistItem
                data={s}
                index={idx}
                key={idx}
                listLength={steps.length}
                isSelected={idx === selectedStepValue}
                primaryColor={appearance.theme.colorPrimary}
                style={{ justifyContent: 'space-between' }}
                onClick={() => {
                  setSelectedStepValue(idx)
                }}
              />
            )
          })}
        </ChecklistStepsContainer>
      </ChecklistHeader>
      <Divider />
      <HeroChecklistStepContentContainer>
        <StepContent appearance={appearance} />
      </HeroChecklistStepContentContainer>
    </HeroChecklistContainer>
  )
}

export default HeroChecklist
