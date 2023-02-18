import React, { CSSProperties, FC, useState } from 'react'
import { Button } from '../../components/Button'

import { FormStepContent, FormStepSubtitle, FormStepTitle } from './styled'

import { StepData } from '../../types'
import { useFlows } from '../../api/flows'
import { COMPLETED_STEP } from '../../api/common'
import { LinkCollectionStepType } from '../LinkCollectionStepType'
import { Modal } from '../../components/Modal'

export interface FormProps {
  title?: string
  subtitle?: string
  primaryColor?: string
  style?: CSSProperties
  type?: 'inline' | 'modal'
  flowId: string

  onCompleteStep?: (index: number, stepData: StepData) => void

  // Object from string to function with StepData returning React.ReactNode
  customStepTypes?: { [key: string]: (stepData: StepData) => React.ReactNode }

  className?: string
}

export const FrigadeForm: FC<FormProps> = ({
  flowId,
  title,
  subtitle,
  primaryColor = '#000000',
  style = {},
  className = '',
  customStepTypes = {},
  type = 'inline',
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
  } = useFlows()

  const [selectedStep, setSelectedStep] = useState(0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [selectedStepInternal, setSelectedStepInternal] = useState(0)
  const DEFAULT_CUSTOM_STEP_TYPES = {
    default: (stepData: StepData) => {
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
    linkCollection: (stepData: StepData) => {
      return <LinkCollectionStepType stepData={stepData} />
    },
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  if (isLoading) {
    return null
  }
  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  const rawSteps = getFlowSteps(flowId)
  if (!rawSteps) {
    return null
  }

  if (!finishedInitialLoad) {
    const completedSteps = Math.min(getNumberOfStepsCompleted(flowId), rawSteps.length - 1)
    setSelectedStep(completedSteps)
    setFinishedInitialLoad(true)
  }

  const steps: StepData[] = rawSteps.map((rawStep) => {
    return {
      ...rawStep,
      complete: getStepStatus(flowId, rawStep.id) === COMPLETED_STEP,
      handleCTAClick: () => {
        if (rawStep.autoMarkCompleted || rawStep.autoMarkCompleted === undefined) {
          markStepCompleted(flowId, rawStep.id)
          setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
        }
      },
    }
  })

  const selectedStepValue = selectedStep ?? selectedStepInternal

  const StepContent = () => {
    if (!steps[selectedStepValue]?.type || !mergedCustomStepTypes[steps[selectedStepValue].type]) {
      return mergedCustomStepTypes['default'](steps[selectedStepValue])
    }
    return mergedCustomStepTypes[steps[selectedStepValue].type](steps[selectedStepValue])
  }

  const content = (
    <div>
      <StepContent />
      <div>
        {steps[selectedStepValue].secondaryButtonTitle ? (
          <Button
            title={steps[selectedStepValue].secondaryButtonTitle}
            onClick={() => {
              if (steps[selectedStepValue].secondaryButtonUri) {
                window.open(steps[selectedStepValue].secondaryButtonUri)
              }
            }}
          />
        ) : null}{' '}
        {steps[selectedStepValue].primaryButtonTitle ? (
          <Button
            title={steps[selectedStepValue].primaryButtonTitle}
            onClick={() => {
              if (steps[selectedStepValue].primaryButtonUri) {
                window.open(steps[selectedStepValue].primaryButtonUri)
              }
            }}
          />
        ) : null}
      </div>
    </div>
  )

  if (type === 'modal') {
    return (
      <Modal onClose={() => setShowModal(false)} style={{ maxWidth: 1024 }} visible={showModal}>
        {content}
      </Modal>
    )
  }

  return content
}
