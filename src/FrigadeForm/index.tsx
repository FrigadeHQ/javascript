import React, { CSSProperties, FC, useEffect, useState } from 'react'

import { Appearance, DefaultFrigadeFlowProps, StepData } from '../types'
import { useFlows } from '../api/flows'
import { COMPLETED_FLOW } from '../api/common'
import { Modal } from '../components/Modal'
import { CornerModal } from '../components/CornerModal'
import { FormInputProps } from './types'
import { useTheme } from '../hooks/useTheme'
import { FormContent } from './FormContent'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import { useFlowOpens } from '../api/flow-opens'
import { FORM_DATA_KEY_PREFIX } from '../components/Forms/MultiInputStepType/MultiInputStepType'

export type FrigadeFormType = 'inline' | 'modal' | 'large-modal' | 'corner-modal'

export interface FrigadeFormProps extends DefaultFrigadeFlowProps {
  /**
   * @ignore
   */
  title?: string
  /**
   * @ignore
   */
  subtitle?: string
  type?: FrigadeFormType
  /**
   * Map of custom components. The key must match the `type` property of the step defined in `config.yml`
   */
  customStepTypes?: {
    [key: string]: (params: {
      flowId: string
      stepData: StepData
      canContinue: boolean
      setCanContinue: (canContinue: boolean) => void
      onSaveData: (data: object) => void
      appearance?: Appearance
      prefillData?: Record<string, any>
      customFormElements?: { [key: string]: (params: FormInputProps) => React.ReactNode }
    }) => React.ReactNode
  }
  /**
   * Map of custom form components. Can only be used with a step of type `multiInput` (defined in `config.yml`).
   * The key must match the `type` property of the input defined in `config.yml`
   */
  customFormElements?: { [key: string]: (params: FormInputProps) => React.ReactNode }
  visible?: boolean
  setVisible?: (visible: boolean) => void
  onComplete?: () => void
  /**
   * Whether to show a dismiss button to exit out of the form. Applicable only for modal forms.
   */
  dismissible?: boolean
  /**
   * If true, the form can be repeated multiple times. Default is false. Useful for e.g. contact/support forms.
   */
  repeatable?: boolean
  /**
   * If true, the user will be excited from the flow when the form is dismissed. Default is false.
   */
  endFlowOnDismiss?: boolean
  /**
   * Indicates the position of the modal if the form type is a modal. Default is center.
   */
  modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  /**
   * Show a pagination indicator at the bottom of the form. Default is false.
   */
  showPagination?: boolean
  /**
   * Whether to allow the user to navigate back to previous steps. Default is false.
   */
  allowBackNavigation?: boolean
  /**
   * @ignore
   */
  showFrigadeBranding?: boolean
  /**
   * This function is called when the user submits data in a step.
   * If it returns a string or explicitly false, the flow will not proceed to the next step.
   * Optionally, if a string is returned it will be displayed as an error message.
   */
  validationHandler?: (
    step: StepData,
    index: number,
    nextStep?: StepData,
    allFormData?: any,
    stepSpecificFormData?: any
  ) => Promise<string | null | boolean | undefined>
  /**
   * Handler that is called when the form data changes.
   */
  onFormDataChange?: (
    allFormData: any,
    stepSpecificFormData: any,
    step: StepData,
    index: number
  ) => void
  /**
   * Show or hide the form footer
   */
  showFooter?: boolean
  /**
   * Data to use for prefilling forms with data.
   * Useful when you want to prefill a form with data from another source.
   * The format of the data maps a step id to the prefill data. Depending on the implementation of the given step type,
   * the value of the data will follow a different structure.
   *
   * For `type` multiInputStep, the value contains another map similar to the structure returned from `onFormDataChange`
   */
  prefillData?: Record<string, any>
  /**
   * Whether to update the url when the page changes in multi-page forms. If enabled, the current url will be updated with the
   * current step id in the following format: `<my_url>?p=<current_step_id>`.
   *
   * This is useful when wanting to capture URL changes with third-party tracking tools.
   *
   * Default is false.
   */
  updateUrlOnPageChange?: boolean
}

export const FrigadeForm: FC<FrigadeFormProps> = ({
  flowId,
  customStepTypes = {},
  type = 'inline',
  visible,
  setVisible,
  customVariables,
  customFormElements,
  onComplete,
  appearance,
  hideOnFlowCompletion = true,
  onStepCompletion,
  onButtonClick,
  dismissible = true,
  endFlowOnDismiss = false,
  modalPosition = 'center',
  repeatable = false,
  onDismiss,
  showPagination = false,
  allowBackNavigation = false,
  validationHandler,
  showFrigadeBranding = false,
  onFormDataChange,
  showFooter = true,
  prefillData = {},
  updateUrlOnPageChange = false,
}) => {
  const {
    getFlow,
    getFlowSteps,
    isLoading,
    targetingLogicShouldHideFlow,
    getFlowStatus,
    getCurrentStepIndex,
    markFlowCompleted,
    markFlowNotStarted,
  } = useFlows()
  const selectedStep = getCurrentStepIndex(flowId)
  const { mergeAppearanceWithDefault } = useTheme()
  const [hasFinishedInitialLoad, setHasFinishedInitialLoad] = useState(false)
  const { setOpenFlowState, getOpenFlowState, hasOpenModals } = useFlowOpens()

  appearance = mergeAppearanceWithDefault(appearance)

  const [showModal, setShowModal] =
    visible !== undefined && setVisible !== undefined
      ? [visible, setVisible]
      : [getOpenFlowState(flowId, true), (value) => setOpenFlowState(flowId, value)]

  useEffect(() => {
    if (!hasFinishedInitialLoad && !isLoading) {
      setHasFinishedInitialLoad(true)
      if (getFlowStatus(flowId) === COMPLETED_FLOW && repeatable) {
        markFlowNotStarted(flowId)
        // Clear all local storage keys that start with FORM_DATA_KEY_PREFIX
        if (window && window.localStorage) {
          const localStorageKeys = Object.keys(window.localStorage)
          localStorageKeys.forEach((key) => {
            if (key.startsWith(FORM_DATA_KEY_PREFIX)) {
              window.localStorage.removeItem(key)
            }
          })
        }
      }
      setHasFinishedInitialLoad(true)
    }
  }, [hasFinishedInitialLoad, setHasFinishedInitialLoad, isLoading])

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

  if ((type == 'modal' || type == 'corner-modal') && hasOpenModals(flowId)) {
    return null
  }

  const handleClose = () => {
    setShowModal(false)
    if (onDismiss) {
      onDismiss()
    }
    if (endFlowOnDismiss === true) {
      markFlowCompleted(flowId)
    }
  }

  if ((modalPosition == 'center' && type === 'modal') || type === 'large-modal') {
    const overrideStyle: CSSProperties = {
      padding: '24px',
    }
    if (type === 'large-modal') {
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
        onClose={handleClose}
        visible={showModal}
        style={overrideStyle}
        dismissible={dismissible}
        showFrigadeBranding={showFrigadeBranding}
      >
        <RenderInlineStyles appearance={appearance} />
        <FormContent
          appearance={appearance}
          steps={steps}
          selectedStep={selectedStep}
          customStepTypes={customStepTypes}
          customVariables={customVariables}
          onButtonClick={onButtonClick}
          onStepCompletion={onStepCompletion}
          flowId={flowId}
          type={type}
          hideOnFlowCompletion={hideOnFlowCompletion}
          onComplete={onComplete}
          setVisible={setVisible}
          setShowModal={setShowModal}
          onDismiss={onDismiss}
          showPagination={showPagination}
          customFormElements={customFormElements}
          allowBackNavigation={allowBackNavigation}
          validationHandler={validationHandler}
          onFormDataChange={onFormDataChange}
          showFooter={showFooter}
          prefillData={prefillData}
          updateUrlOnPageChange={updateUrlOnPageChange}
        />
      </Modal>
    )
  }

  if (type === 'modal' && modalPosition !== 'center') {
    return (
      <CornerModal
        appearance={appearance}
        onClose={handleClose}
        visible={showModal}
        modalPosition={modalPosition}
      >
        <RenderInlineStyles appearance={appearance} />
        <FormContent
          appearance={appearance}
          steps={steps}
          selectedStep={selectedStep}
          customStepTypes={customStepTypes}
          customVariables={customVariables}
          onButtonClick={onButtonClick}
          onStepCompletion={onStepCompletion}
          flowId={flowId}
          type={type}
          hideOnFlowCompletion={hideOnFlowCompletion}
          onComplete={onComplete}
          setVisible={setVisible}
          setShowModal={setShowModal}
          onDismiss={onDismiss}
          showPagination={showPagination}
          customFormElements={customFormElements}
          allowBackNavigation={allowBackNavigation}
          validationHandler={validationHandler}
          onFormDataChange={onFormDataChange}
          showFooter={showFooter}
          prefillData={prefillData}
          updateUrlOnPageChange={updateUrlOnPageChange}
        />
      </CornerModal>
    )
  }

  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <FormContent
        appearance={appearance}
        steps={steps}
        selectedStep={selectedStep}
        customStepTypes={customStepTypes}
        customVariables={customVariables}
        onButtonClick={onButtonClick}
        onStepCompletion={onStepCompletion}
        flowId={flowId}
        type={type}
        hideOnFlowCompletion={hideOnFlowCompletion}
        onComplete={onComplete}
        setVisible={setVisible}
        setShowModal={setShowModal}
        onDismiss={onDismiss}
        showPagination={showPagination}
        customFormElements={customFormElements}
        allowBackNavigation={allowBackNavigation}
        validationHandler={validationHandler}
        onFormDataChange={onFormDataChange}
        showFooter={showFooter}
        prefillData={prefillData}
        updateUrlOnPageChange={updateUrlOnPageChange}
      />
    </>
  )
}

export default FrigadeForm
