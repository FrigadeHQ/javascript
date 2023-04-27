import { MultiInputStepType } from '../components/Forms/MultiInputStepType/MultiInputStepType'
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
import { LinkCollectionStepType } from '../components/Forms/LinkCollectionStepType'
import { CallToActionStepType } from '../components/Forms/CallToActionStepType/CallToActionStepType'
import { SelectListStepType } from '../components/Forms/SelectListStepType/SelectListStepType'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { FrigadeFormType } from './index'
import React, { FC, useEffect, useState } from 'react'
import { CustomFormTypeProps } from './types'
import { useFlows } from '../api/flows'
import { AnimatePresence, motion } from 'framer-motion'

interface FormContentProps extends DefaultFrigadeFlowProps {
  appearance: Appearance
  steps: StepData[]
  selectedStep: number
  customStepTypes?: { [key: string]: (params: CustomFormTypeProps) => React.ReactNode }
  type: FrigadeFormType
  setShowModal: (showModal: boolean) => void
  setVisible?: (visible: boolean) => void
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

  const [canContinue, setCanContinue] = useState(false)
  const [formData, setFormData] = useState({})
  const {
    markStepCompleted,
    markStepStarted,
    isLoading,
    setCustomVariable,
    customVariables: existingCustomVariables,
    markFlowCompleted,
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
          appearance={appearance}
          className={getClassName('formContainerSidebarImage', appearance)}
        />
      )
    }
    return null
  }

  const formFooter = (
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
          markFlowCompleted(flowId)
        }
        primaryCTAClickSideEffects(steps[selectedStep])
      }}
      onSecondaryClick={() => {
        handleStepCompletionHandlers(steps[selectedStep], 'secondary', selectedStep)
        secondaryCTAClickSideEffects(steps[selectedStep])
      }}
      onBack={() => {}}
      steps={steps}
    />
  )

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <FormContainer className={getClassName('formContainer', appearance)}>
        <FormContainerMain>
          <AnimatePresence initial={false}>
            {steps.map((step, idx) => {
              if (idx !== selectedStep) {
                return null
              }

              if (type !== 'large-modal') {
                return (
                  <FormContainerWrapper
                    key={step.id}
                    type={type}
                    className={getClassName('formContent', appearance)}
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
                    {formFooter}
                  </FormContainerWrapper>
                )
              }

              return (
                <motion.div
                  key={step.id}
                  initial={{
                    opacity: 1,
                    y: '-100%',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: '100%',
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    overflowY: 'auto',
                  }}
                >
                  <FormContainerWrapper
                    type={type}
                    className={getClassName('formContent', appearance)}
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
                    {formFooter}
                  </FormContainerWrapper>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </FormContainerMain>
        {type == 'large-modal' && <FormContainerSidebar selectedStep={steps[selectedStep]} />}
      </FormContainer>
    </>
  )
}
