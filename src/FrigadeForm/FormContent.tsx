import { MultiInputStepType } from '../Forms/MultiInputStepType/MultiInputStepType'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../types'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import {
  FormContainer,
  FormContainerMain,
  FormContainerSidebarImage,
  FormContainerWrapper,
} from './styled'
import { getClassName } from '../shared/appearance'
import { FormFooter } from './FormFooter'
import { LinkCollectionStepType } from '../Forms/LinkCollectionStepType'
import { CallToActionStepType } from '../Forms/CallToActionStepType/CallToActionStepType'
import { SelectListStepType } from '../Forms/SelectListStepType/SelectListStepType'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { FrigadeFormType } from './index'
import React, { FC, useEffect, useState } from 'react'
import { CustomFormTypeProps } from './types'
import { useFlows } from '../api/flows'

interface FormContentProps extends DefaultFrigadeFlowProps {
  appearance: Appearance
  steps: StepData[]
  selectedStep: number
  customStepTypes?: { [key: string]: (params: CustomFormTypeProps) => React.ReactNode }
  type: FrigadeFormType
  setShowModal: (showModal: boolean) => void
}
export const FormContent: FC<FormContentProps> = ({
  appearance,
  steps,
  selectedStep,
  customStepTypes,
  customVariables,
  onButtonClick,
  onStepCompletion,
  flowId,
  type,
  hideOnFlowCompletion,
  onComplete,
  setVisible,
  setShowModal,
}) => {
  const DEFAULT_CUSTOM_STEP_TYPES = {
    linkCollection: LinkCollectionStepType,
    multiInput: MultiInputStepType,
    callToAction: CallToActionStepType,
    selectList: SelectListStepType,
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()

  const StepContent = mergedCustomStepTypes[steps[selectedStep]?.type] ?? MultiInputStepType
  const [canContinue, setCanContinue] = useState(false)
  const [formData, setFormData] = useState({})
  const {
    markStepCompleted,
    markStepStarted,
    isLoading,
    setCustomVariable,
    customVariables: existingCustomVariables,
  } = useFlows()

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

  function getDataPayload() {
    const data = formData[steps[selectedStep].id] ?? {}
    return {
      data: data,
      stepId: steps[selectedStep].id,
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

  function FormContainerSidebar(props: { selectedStep: StepData }) {
    if (props.selectedStep.imageUri) {
      return (
        <FormContainerSidebarImage
          image={props.selectedStep.imageUri}
          className={getClassName('formContainerSidebarImage', appearance)}
        />
      )
    }
    return null
  }

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <FormContainer className={getClassName('formContainer', appearance)}>
        <FormContainerMain>
          <FormContainerWrapper type={type} className={getClassName('formContent', appearance)}>
            {steps.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  style={{
                    display: idx === selectedStep ? 'block' : 'none',
                  }}
                >
                  {mergedCustomStepTypes[steps[idx]?.type]({
                    stepData: steps[idx],
                    canContinue: canContinue,
                    setCanContinue: setCanContinue,
                    onSaveData: (data) => {
                      updateData(steps[idx], data)
                    },
                    appearance: appearance,
                  })}
                </div>
              )
            })}
            <FormFooter
              step={steps[selectedStep]}
              canContinue={canContinue}
              formType={type}
              selectedStep={selectedStep}
              appearance={appearance}
              onPrimaryClick={() => {
                if (selectedStep + 1 < steps.length) {
                  markStepStarted(flowId, steps[selectedStep + 1].id)
                }
                markStepCompleted(flowId, steps[selectedStep].id, getDataPayload())
                handleStepCompletionHandlers(steps[selectedStep], 'primary', selectedStep)
                if (selectedStep + 1 >= steps.length) {
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
                primaryCTAClickSideEffects(steps[selectedStep])
              }}
              onSecondaryClick={() => {
                handleStepCompletionHandlers(steps[selectedStep], 'secondary', selectedStep)
                secondaryCTAClickSideEffects(steps[selectedStep])
              }}
              onBack={() => {}}
              steps={steps}
              currentStep={selectedStep}
            />
          </FormContainerWrapper>
        </FormContainerMain>
        {type == 'large-modal' && <FormContainerSidebar selectedStep={steps[selectedStep]} />}
      </FormContainer>
    </>
  )
}
