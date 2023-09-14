import {
  FORM_DATA_KEY_PREFIX,
  MultiInputStepType,
} from '../components/Forms/MultiInputStepType/MultiInputStepType'
import { Appearance, StepData } from '../types'
import { FormContainer, FormContainerSidebarImage, FormContainerWrapper } from './styled'
import { getClassName } from '../shared/appearance'
import { FormFooter } from './FormFooter'
import { FormPagination } from './FormPagination'
import { LinkCollectionStepType } from '../components/Forms/LinkCollectionStepType'
import { CallToActionStepType } from '../components/Forms/CallToActionStepType/CallToActionStepType'
import { SelectListStepType } from '../components/Forms/SelectListStepType/SelectListStepType'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { FrigadeFormProps, FrigadeFormType } from './index'
import React, { FC, useEffect, useState } from 'react'
import { CustomFormTypeProps, FormInputProps } from './types'
import { useFlows } from '../api/flows'

const AnimationWrapper = ({ children, id, shouldWrap = false }) => {
  return (
    <>
      {shouldWrap ? (
        <div
          key={id}
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
          {children}
        </div>
      ) : (
        children
      )}
    </>
  )
}

interface FormContentProps extends FrigadeFormProps {
  appearance: Appearance
  steps: StepData[]
  selectedStep: number
  customStepTypes?: {
    [key: string]: ((params: CustomFormTypeProps) => React.ReactNode) | React.ReactNode
  }
  type: FrigadeFormType
  setShowModal: (showModal: boolean) => void
  setVisible?: (visible: boolean) => void
  showPagination?: boolean
  customFormElements?: { [key: string]: (params: FormInputProps) => React.ReactNode }
  allowBackNavigation: boolean
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
  onDismiss,
  showPagination = false,
  customFormElements,
  allowBackNavigation,
  validationHandler,
  onFormDataChange,
  showFooter,
  prefillData,
  updateUrlOnPageChange,
  repeatable,
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
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)

  const currentStep = steps[selectedStep] ?? null
  const {
    markStepCompleted,
    markStepStarted,
    isLoading,
    updateCustomVariables,
    markFlowCompleted,
  } = useFlows()

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData, getDataPayload(), steps[selectedStep], selectedStep)
    }
  }, [formData])

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
    if (onStepCompletion) {
      onStepCompletion(step, idx, maybeNextStep, formData, getDataPayload())
    }
    if (onButtonClick) {
      return onButtonClick(step, selectedStep, cta, maybeNextStep)
    }
    return true
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

  const formFooter = showFooter && (
    <FormFooter
      step={steps[selectedStep]}
      canContinue={canContinue && !isSaving}
      formType={type}
      selectedStep={selectedStep}
      appearance={appearance}
      onPrimaryClick={async () => {
        setIsSaving(true)
        if (validationHandler) {
          const validationError = await validationHandler(
            steps[selectedStep],
            selectedStep,
            steps[selectedStep + 1],
            formData,
            getDataPayload()
          )
          if (validationError !== true) {
            // check if validation error is a string
            if (typeof validationError === 'string') {
              setErrorMessage(validationError)
            } else {
              setErrorMessage(null)
            }
            setIsSaving(false)
            return
          } else {
            setErrorMessage(null)
          }
        }
        const payload = { ...getDataPayload() }
        await markStepCompleted(flowId, steps[selectedStep].id, payload)
        if (
          selectedStep + 1 < steps.length &&
          // the url hash will control current step if allowBackNavigation is true
          !allowBackNavigation
        ) {
          await markStepStarted(flowId, steps[selectedStep + 1].id)
        }
        const shouldClose = handleStepCompletionHandlers(
          steps[selectedStep],
          'primary',
          selectedStep
        )
        if (selectedStep + 1 >= steps.length) {
          if (onComplete) {
            onComplete()
          }
          if (onDismiss) {
            onDismiss()
          }
          if (hideOnFlowCompletion && shouldClose) {
            if (setVisible) {
              setVisible(false)
            }
            setShowModal(false)
          }
          await markFlowCompleted(flowId)
          if (repeatable) {
            // Set index back to 0
            await markStepStarted(flowId, steps[0].id)
            // Clear all cached form fill data
            if (typeof window !== 'undefined' && window.localStorage) {
              const localStorageKeys = Object.keys(window.localStorage)
              localStorageKeys.forEach((key) => {
                if (key.startsWith(FORM_DATA_KEY_PREFIX)) {
                  window.localStorage.removeItem(key)
                }
              })
            }
          }
        }
        primaryCTAClickSideEffects(steps[selectedStep])
        setIsSaving(false)
        if (
          typeof window !== 'undefined' &&
          !allowBackNavigation &&
          updateUrlOnPageChange &&
          selectedStep + 1 < steps.length
        ) {
          // Update the current url with a query param p=stepId -- only use when allowbacknavigation is false
          const url = new URL(window.location.href)
          url.searchParams.set('p', steps[selectedStep + 1].id)
          window.history.pushState({}, '', url.toString())
        }
      }}
      onSecondaryClick={() => {
        handleStepCompletionHandlers(steps[selectedStep], 'secondary', selectedStep)
        secondaryCTAClickSideEffects(steps[selectedStep])
      }}
      onBack={async () => {
        if (selectedStep - 1 >= 0) {
          setIsSaving(true)
          await markStepStarted(flowId, steps[selectedStep - 1].id)
          setIsSaving(false)
        }
      }}
      steps={steps}
      allowBackNavigation={allowBackNavigation}
      errorMessage={errorMessage}
      isSaving={isSaving}
    />
  )

  return (
    <>
      <FormContainer className={getClassName('formContainer', appearance)}>
        <AnimationWrapper id={selectedStep} shouldWrap={type === 'large-modal'}>
          <FormContainerWrapper
            key={currentStep.id}
            type={type}
            className={getClassName('formContent', appearance)}
          >
            {steps.map((step) => {
              const StepComponent = mergedCustomStepTypes[step.type]

              if (currentStep.id !== step.id) {
                return null
              }

              // Check if StepComponent is a function
              if (typeof StepComponent !== 'function') {
                return StepComponent
              }

              return (
                <StepComponent
                  key={step.id}
                  stepData={step}
                  canContinue={canContinue}
                  setCanContinue={setCanContinue}
                  onSaveData={(data) => {
                    updateData(step, data)
                  }}
                  appearance={appearance}
                  customFormElements={customFormElements}
                  flowId={flowId}
                  prefillData={prefillData}
                />
              )
            })}
            {showPagination && (
              <FormPagination
                className={getClassName('formPagination', appearance)}
                appearance={appearance}
                stepCount={steps.length}
                currentStep={selectedStep}
              />
            )}
            {formFooter}
          </FormContainerWrapper>
        </AnimationWrapper>
        {type == 'large-modal' && <FormContainerSidebar selectedStep={steps[selectedStep]} />}
      </FormContainer>
    </>
  )
}
