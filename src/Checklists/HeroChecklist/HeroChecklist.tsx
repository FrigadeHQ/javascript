import React, { CSSProperties, FC, useState } from 'react'

import styled from 'styled-components'
import { StepChecklistItem } from './StepChecklistItem'
import { ProgressBar } from '../Checklist/Progress'
import { Button } from '../../components/Button'

import {
  HeroChecklistStepContent,
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from './styled'
import { VideoPlayer } from './VideoPlayer'
import { StepData } from '../../types'

export interface HeroChecklistProps {
  title?: string
  subtitle?: string
  primaryColor?: string
  style?: CSSProperties
  steps?: StepData[]

  onCompleteStep?: (index: number, stepData: StepData) => void

  // Optional props
  selectedStep?: number
  setSelectedStep?: (index: number) => void

  // Map from string to function with StepData returning React.ReactNode
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>

  className?: string
}

const HeroChecklistContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 1000px;
  margin: 40px 40px 40px 40px;
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
`

const HeroChecklistTitle = styled.p`
  font-size: 24px;
  font-weight: 600;
`

const HeroChecklistSubtitle = styled.p`
  font-size: 15px;
  line-height: 20px;
  color: #4d4d4d;
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

const StepImage = styled.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`

const HeroChecklist: FC<HeroChecklistProps> = ({
  title,
  subtitle,
  steps = [],
  primaryColor = '#000000',
  style = {},
  selectedStep,
  setSelectedStep,
  className = '',
  customStepTypes = new Map(),
}) => {
  const DEFAULT_CUSTOM_STEP_TYPES = new Map([
    [
      'default',
      (stepData: StepData) => {
        if (steps[selectedStepValue]?.StepContent) {
          const Content: React.ReactNode = steps[selectedStepValue].StepContent
          return <div>{Content}</div>
        }
        const currentStep = steps[selectedStepValue]
        const handleCTAClick = () => {
          if (currentStep.handleCTAClick) {
            currentStep.handleCTAClick()
          }
          if (currentStep.url) {
            window.open(currentStep.url, currentStep.urlTarget ?? '_blank')
          }
        }
        return (
          <HeroChecklistStepContent>
            {stepData.imageUri ? (
              <StepImage src={stepData.imageUri} style={stepData.imageStyle} />
            ) : null}
            {stepData.videoUri ? <VideoPlayer videoUri={stepData.videoUri} /> : null}
            <HeroChecklistStepTitle>{stepData.title}</HeroChecklistStepTitle>
            <HeroChecklistStepSubtitle>{stepData.subtitle}</HeroChecklistStepSubtitle>
            <Button
              title={stepData.primaryButtonTitle}
              onClick={handleCTAClick}
              style={{ backgroundColor: primaryColor, borderColor: primaryColor, width: 'auto' }}
            />
          </HeroChecklistStepContent>
        )
      },
    ],
  ])

  const mergedCustomStepTypes = new Map([...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes])

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal
  const setSelectedStepValue = setSelectedStep ?? setSelectedStepInternal

  const completeCount = steps.filter((s) => s.complete === true).length

  const StepContent = () => {
    if (
      !steps[selectedStepValue]?.type ||
      !mergedCustomStepTypes.has(steps[selectedStepValue].type)
    ) {
      return mergedCustomStepTypes.get('default')(steps[selectedStepValue])
    }
    return mergedCustomStepTypes.get(steps[selectedStepValue].type)(steps[selectedStepValue])
  }

  return (
    <HeroChecklistContainer style={style} className={className}>
      <ChecklistHeader style={{ flex: 1 }}>
        <ChecklistHeader style={{ padding: '30px 0px 30px 30px', borderBottom: 'none' }}>
          <HeroChecklistTitle>{title}</HeroChecklistTitle>
          <HeroChecklistSubtitle>{subtitle}</HeroChecklistSubtitle>
          <ProgressBar total={steps.length} count={completeCount} fillColor={primaryColor} />
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
                primaryColor={primaryColor}
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
        <StepContent />
      </HeroChecklistStepContentContainer>
    </HeroChecklistContainer>
  )
}

export default HeroChecklist
