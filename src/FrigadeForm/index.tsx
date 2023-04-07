import React, { CSSProperties, FC, useEffect, useState } from 'react'

import {
  FormContainer,
  FormContainerMain,
  FormContainerSidebarImage,
  FormContainerWrapper,
} from './styled'

import { DefaultFrigadeFlowProps, StepData } from '../types'
import { useFlows } from '../api/flows'
import { COMPLETED_FLOW, STARTED_FLOW } from '../api/common'
import { LinkCollectionStepType } from '../Forms/LinkCollectionStepType'
import { Modal } from '../components/Modal'
import { CornerModal } from '../components/CornerModal'
import { MultiInputStepType } from '../Forms/MultiInputStepType/MultiInputStepType'
import { CustomFormTypeProps } from './types'
import { getClassName } from '../shared/appearance'
import { CallToActionStepType } from '../Forms/CallToActionStepType/CallToActionStepType'
import { SelectListStepType } from '../Forms/SelectListStepType/SelectListStepType'
import { FormFooter } from './FormFooter'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'

export type FrigadeFormType = 'inline' | 'modal' | 'corner-modal' | 'full-screen-modal'

export interface FormProps extends DefaultFrigadeFlowProps {
  title?: string
  subtitle?: string
  type?: FrigadeFormType
  onCompleteStep?: (index: number, stepData: StepData) => void
  customStepTypes?: { [key: string]: (params: CustomFormTypeProps) => React.ReactNode }
  visible?: boolean
  setVisible?: (visible: boolean) => void
  onComplete?: () => void
  dismissible?: boolean
  repeatable?: boolean
}

export const FrigadeForm: FC<FormProps> = ({
  flowId,
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
  dismissible = true,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    setCustomVariable,
    customVariables: existingCustomVariables,
    getFlowStatus,
    getCurrentStepIndex,
  } = useFlows()
  const { mergeAppearanceWithDefault } = useTheme()

  appearance = mergeAppearanceWithDefault(appearance)

  const [selectedStep, setSelectedStep] = useState(0)
  const [finishedInitialLoad, setFinishedInitialLoad] = useState(false)
  const [showModal, setShowModal] =
    visible !== undefined && setVisible !== undefined ? [visible, setVisible] : useState(true)
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()
  const currentFlowStatus = getFlowStatus(flowId)
  const DEFAULT_CUSTOM_STEP_TYPES = {
    linkCollection: LinkCollectionStepType,
    multiInput: MultiInputStepType,
    callToAction: CallToActionStepType,
    selectList: SelectListStepType,
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

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

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (currentFlowStatus !== STARTED_FLOW) {
      return
    }

    if (!finishedInitialLoad) {
      setSelectedStep(getCurrentStepIndex(flowId))
      setFinishedInitialLoad(true)
    }
  }, [finishedInitialLoad, getCurrentStepIndex, flowId, isLoading])

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

  const steps = getFlowSteps(flowId)
  if (!steps) {
    return null
  }

  if (visible !== undefined && visible === false) {
    return null
  }

  if (getFlowStatus(flowId) === COMPLETED_FLOW && hideOnFlowCompletion) {
    return null
  }

  function FormContent() {
    const StepContent = mergedCustomStepTypes[steps[selectedStep]?.type] ?? MultiInputStepType
    const [canContinue, setCanContinue] = useState(false)
    const [formData, setFormData] = useState({})

    function getDataPayload() {
      const data = formData[steps[selectedStep].id] ?? {}
      return {
        data: data,
        stepId: steps[selectedStep].id,
        customVariables: customVariables,
      }
    }

    function handleStepCompletionHandlers(
      step: StepData,
      cta: 'primary' | 'secondary',
      idx: number
    ) {
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

    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        <FormContainer className={getClassName('formContainer', appearance)}>
          <FormContainerMain>
            <FormContainerWrapper type={type} className={getClassName('formContent', appearance)}>
              <StepContent
                stepData={steps[selectedStep]}
                canContinue={canContinue}
                setCanContinue={setCanContinue}
                onSaveData={(data) => {
                  updateData(steps[selectedStep], data)
                }}
                appearance={appearance}
              />
              <FormFooter
                step={steps[selectedStep]}
                canContinue={canContinue}
                formType={type}
                appearance={appearance}
                onPrimaryClick={() => {
                  primaryCTAClickSideEffects(steps[selectedStep])
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
                  } else {
                    setSelectedStep(selectedStep + 1)
                  }
                }}
                onSecondaryClick={() => {
                  secondaryCTAClickSideEffects(steps[selectedStep])
                  handleStepCompletionHandlers(steps[selectedStep], 'secondary', selectedStep)
                }}
                onBack={() => {
                  if (selectedStep - 1 >= 0) {
                    setSelectedStep(selectedStep - 1)
                  }
                }}
                steps={steps}
                currentStep={selectedStep}
              />
            </FormContainerWrapper>
          </FormContainerMain>
          {type == 'full-screen-modal' && (
            <FormContainerSidebar selectedStep={steps[selectedStep]} />
          )}
        </FormContainer>
      </>
    )
  }

  if (type === 'modal' || type === 'full-screen-modal') {
    const overrideStyle: CSSProperties = {
      padding: '24px',
    }
    if (type === 'full-screen-modal') {
      overrideStyle.width = '85%'
      overrideStyle.height = '90%'
      overrideStyle.maxHeight = '800px'
      overrideStyle.minHeight = '500px'
      overrideStyle.padding = '0'
    } else {
      overrideStyle.width = '400px'
    }
    return (
      <Modal
        appearance={appearance}
        onClose={() => setShowModal(false)}
        visible={showModal}
        style={overrideStyle}
        dismissible={dismissible}
      >
        <FormContent />
      </Modal>
    )
  }

  if (type === 'corner-modal') {
    return (
      <CornerModal appearance={appearance} onClose={() => setShowModal(false)} visible={showModal}>
        <FormContent />
      </CornerModal>
    )
  }

  return <FormContent />
}

export default FrigadeForm
