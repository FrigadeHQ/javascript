import React, { FC, useEffect, useState } from 'react'
import { Button } from '../components/Button'

import { FormContainer, FormCTAContainer } from './styled'

import { DefaultFrigadeFlowProps, mergeAppearanceWithDefault, StepData } from '../types'
import { useFlows } from '../api/flows'
import { COMPLETED_FLOW, COMPLETED_STEP } from '../api/common'
import { LinkCollectionStepType } from '../Forms/LinkCollectionStepType'
import { Modal } from '../components/Modal'
import { CornerModal } from '../components/CornerModal'
import { MultiInputStepType } from '../Forms/MultiInputStepType/MultiInputStepType'
import { CustomFormTypeProps } from './types'
import { getClassName } from '../shared/appearance'
import { CallToActionStepType } from '../Forms/CallToActionStepType/CallToActionStepType'

export interface FormProps extends DefaultFrigadeFlowProps {
  title?: string
  subtitle?: string
  primaryColor?: string
  type?: 'inline' | 'modal' | 'corner-modal'
  customStepTypes?: { [key: string]: (params: CustomFormTypeProps) => React.ReactNode }
  visible?: boolean
  setVisible?: (visible: boolean) => void
  onComplete?: () => void
}

export const FrigadeForm: FC<FormProps> = ({
  flowId,
  title,
  subtitle,
  primaryColor,
  style = {},
  className = '',
  customStepTypes = {},
  type = 'inline',
  visible,
  setVisible,
  customVariables,
  onComplete,
  appearance,
  hideOnFlowCompletion = true,
  onStepCompletion,
  onButtonClick,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
    getFlowStatus,
  } = useFlows()

  appearance = mergeAppearanceWithDefault(appearance)

  if (primaryColor) {
    appearance.theme.colorPrimary = primaryColor
  }

  const [canContinue, setCanContinue] = useState(false)
  const [selectedStep, setSelectedStep] = useState(0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [showModal, setShowModal] =
    visible !== undefined && setVisible !== undefined ? [visible, setVisible] : useState(true)
  const [selectedStepInternal, setSelectedStepInternal] = useState(0)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (
      !isLoading &&
      customVariables &&
      JSON.stringify(existingCustomVariables) !=
        JSON.stringify({ ...existingCustomVariables, ...customVariables })
    ) {
      Object.keys(customVariables).forEach((key) => {
        setCustomVariable(key, customVariables[key])
      })
    }
  }, [isLoading, customVariables, setCustomVariable, existingCustomVariables])

  const DEFAULT_CUSTOM_STEP_TYPES = {
    linkCollection: LinkCollectionStepType,
    multiInput: MultiInputStepType,
    callToAction: CallToActionStepType,
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  if (isLoading) {
    return null
  }
  const flow = getFlow(flowId)
  if (!flow) {
    return null
  }

  if (targetingLogicShouldHideFlow(flow)) {
    return null
  }

  const rawSteps = getFlowSteps(flowId)
  if (!rawSteps) {
    return null
  }

  if (visible !== undefined && visible === false) {
    return null
  }

  if (!finishedInitialLoad) {
    const completedSteps = Math.min(getNumberOfStepsCompleted(flowId), rawSteps.length - 1)
    setSelectedStep(completedSteps)
    setFinishedInitialLoad(true)
  }

  if (getFlowStatus(flowId) === COMPLETED_FLOW && hideOnFlowCompletion) {
    return null
  }

  const steps: StepData[] = rawSteps.map((rawStep) => {
    return {
      ...rawStep,
      complete: getStepStatus(flowId, rawStep.id) === COMPLETED_STEP,
      handlePrimaryButtonClick: () => {
        if (
          !rawStep.completionCriteria &&
          (rawStep.autoMarkCompleted || rawStep.autoMarkCompleted === undefined)
        ) {
          markStepCompleted(flowId, rawStep.id)
          setSelectedStep(selectedStep + 1 >= steps.length ? selectedStep : selectedStep + 1)
        }
      },
    }
  })

  const selectedStepValue = selectedStep ?? selectedStepInternal

  function updateData(step: StepData, data: object) {
    setFormData((prevState) => {
      let newObj = {}
      newObj[step.id] = data
      return {
        ...prevState,
        ...newObj,
      }
    })
  }

  const StepContent = mergedCustomStepTypes[steps[selectedStepValue]?.type] ?? MultiInputStepType

  function getDataPayload() {
    const data = formData[steps[selectedStepValue].id] ?? {}
    return {
      data: data,
      stepId: steps[selectedStepValue].id,
      customVariables: customVariables,
    }
  }

  function handleStepCompletionHandlers(step: StepData, cta: 'primary' | 'secondary', idx: number) {
    const maybeNextStep = selectedStep + 1 < steps.length ? steps[selectedStep + 1] : null
    if (onButtonClick) {
      onButtonClick(step, selectedStep, cta, maybeNextStep)
    }
    if (onStepCompletion) {
      onStepCompletion(step, idx, maybeNextStep, formData, getDataPayload())
    }
  }

  const content = (
    <FormContainer className={getClassName('formContainer', appearance)}>
      <StepContent
        stepData={steps[selectedStepValue]}
        canContinue={canContinue}
        setCanContinue={setCanContinue}
        onSaveData={(data) => {
          updateData(steps[selectedStepValue], data)
        }}
        appearance={appearance}
      />
      <FormCTAContainer className={getClassName('formCTAContainer', appearance)}>
        {steps[selectedStepValue].secondaryButtonTitle ? (
          <Button
            title={steps[selectedStepValue].secondaryButtonTitle}
            onClick={() => {
              if (steps[selectedStepValue].secondaryButtonUri) {
                window.open(steps[selectedStepValue].secondaryButtonUri)
              }
              handleStepCompletionHandlers(steps[selectedStepValue], 'secondary', selectedStepValue)
            }}
            secondary={true}
            type={type == 'corner-modal' ? 'full-width' : 'inline'}
            style={{
              display: 'inline-block',
              marginRight: 12,
              marginBottom: 0,
            }}
            appearance={appearance}
          />
        ) : null}{' '}
        {steps[selectedStepValue].primaryButtonTitle ? (
          <Button
            disabled={!canContinue}
            title={steps[selectedStepValue].primaryButtonTitle}
            onClick={() => {
              if (steps[selectedStepValue].primaryButtonUri) {
                window.open(steps[selectedStepValue].primaryButtonUri)
              }
              markStepCompleted(flowId, steps[selectedStepValue].id, getDataPayload())
              handleStepCompletionHandlers(steps[selectedStepValue], 'primary', selectedStepValue)
              if (selectedStepValue + 1 >= steps.length) {
                if (onComplete) {
                  onComplete()
                }
                if (hideOnFlowCompletion) {
                  if (setVisible) {
                    setVisible(false)
                  }
                  setShowModal(false)
                }
              }
            }}
            type={type == 'corner-modal' ? 'full-width' : 'inline'}
            style={{
              display: 'inline-block',
              marginBottom: 0,
            }}
            appearance={appearance}
          />
        ) : null}
      </FormCTAContainer>
    </FormContainer>
  )

  if (type === 'modal') {
    return (
      <Modal appearance={appearance} onClose={() => setShowModal(false)} visible={showModal}>
        {content}
      </Modal>
    )
  }

  if (type === 'corner-modal') {
    return (
      <CornerModal appearance={appearance} onClose={() => setShowModal(false)} visible={showModal}>
        {content}
      </CornerModal>
    )
  }

  return content
}

export default FrigadeForm
