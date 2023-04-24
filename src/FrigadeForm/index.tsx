import React, { CSSProperties, FC, useEffect, useState } from 'react'

import { DefaultFrigadeFlowProps, StepData } from '../types'
import { useFlows } from '../api/flows'
import { COMPLETED_FLOW } from '../api/common'
import { Modal, ModalPosition } from '../components/Modal'
import { CornerModal } from '../components/CornerModal'
import { CustomFormTypeProps } from './types'
import { useTheme } from '../hooks/useTheme'
import { FormContent } from './FormContent'

export type FrigadeFormType = 'inline' | 'modal' | 'large-modal' | 'corner-modal'

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
  endFlowOnDismiss?: boolean
  modalPosition?: ModalPosition
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
  endFlowOnDismiss = false,
  modalPosition = 'center',
  repeatable = false,
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

  appearance = mergeAppearanceWithDefault(appearance)

  const [showModal, setShowModal] =
    visible !== undefined && setVisible !== undefined ? [visible, setVisible] : useState(true)

  useEffect(() => {
    if (!hasFinishedInitialLoad && !isLoading) {
      setHasFinishedInitialLoad(true)
      if (getFlowStatus(flowId) === COMPLETED_FLOW && repeatable) {
        markFlowNotStarted(flowId)
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

  const handleClose = () => {
    setShowModal(false)
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
      >
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
        />
      </Modal>
    )
  }

  if (type === 'modal' && modalPosition !== 'center') {
    return (
      <CornerModal appearance={appearance} onClose={handleClose} visible={showModal}>
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
        />
      </CornerModal>
    )
  }

  return (
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
    />
  )
}

export default FrigadeForm
