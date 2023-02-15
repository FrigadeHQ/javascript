import React, { CSSProperties, FC, useState } from 'react'
import { Button } from '../../components/Button'

import {
  Divider,
  FormContainer,
  FormHeader,
  FormStepContent,
  FormStepContentContainer,
  FormStepSubtitle,
  FormStepTitle,
  FormSubtitle,
  FormTitle,
  StepImage,
} from './styled'

import { StepData } from '../../types'
import { VideoPlayer } from '../../Checklists/HeroChecklist/VideoPlayer'

export interface FormProps {
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

const Form: FC<FormProps> = ({
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
          <FormStepContent>
            {stepData.imageUri ? (
              <StepImage src={stepData.imageUri} style={stepData.imageStyle} />
            ) : null}
            {stepData.videoUri ? <VideoPlayer videoUri={stepData.videoUri} /> : null}
            <FormStepTitle>{stepData.title}</FormStepTitle>
            <FormStepSubtitle>{stepData.subtitle}</FormStepSubtitle>
            <Button
              title={stepData.primaryButtonTitle}
              onClick={handleCTAClick}
              style={{ backgroundColor: primaryColor, borderColor: primaryColor, width: 'auto' }}
            />
          </FormStepContent>
        )
      },
    ],
  ])

  const mergedCustomStepTypes = new Map([...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes])

  const [selectedStepInternal, setSelectedStepInternal] = useState(0)

  const selectedStepValue = selectedStep ?? selectedStepInternal

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
    <FormContainer style={style} className={className}>
      <FormHeader>
        <FormHeader>
          <FormTitle>{title}</FormTitle>
          <FormSubtitle>{subtitle}</FormSubtitle>
        </FormHeader>
      </FormHeader>
      <Divider />
      <FormStepContentContainer>
        <StepContent />
      </FormStepContentContainer>
    </FormContainer>
  )
}

export default Form
