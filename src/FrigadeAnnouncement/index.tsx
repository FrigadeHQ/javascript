import { DefaultFrigadeFlowProps } from '../types'
import React, { CSSProperties, useEffect } from 'react'
import { useFlows } from '../api/flows'
import { useCTAClickSideEffects } from '../hooks/useCTAClickSideEffects'
import { useTheme } from '../hooks/useTheme'
import { COMPLETED_FLOW } from '../api/common'
import { RenderInlineStyles } from '../components/RenderInlineStyles'
import {
  AnnouncementContainer,
  CallToActionContainer,
  DismissButton,
  HeaderSubtitle,
  HeaderTitle,
  MediaContainer,
  TextContainer,
} from './styled'
import { getClassName, mergeClasses } from '../shared/appearance'
import { Close } from '../components/Icons/Close'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { CornerModal } from '../components/CornerModal'
import { useFlowOpens } from '../api/flow-opens'
import { Media } from '../components/Media'
import { sanitize } from '../shared/sanitizer'

export interface FrigadeAnnouncementProps extends DefaultFrigadeFlowProps {
  dismissible?: boolean
  /**
   * Indicates the position of the modal if the form type is a modal. Default is center.
   */
  modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'inline'
}

export const FrigadeAnnouncement: React.FC<FrigadeAnnouncementProps> = ({
  flowId,
  onDismiss,
  customVariables,
  onButtonClick,
  appearance,
  className,
  style,
  dismissible = true,
  modalPosition,
}) => {
  const {
    getFlow,
    markFlowCompleted,
    markStepCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
    updateCustomVariables,
    getFlowSteps,
    getFlowStatus,
    getCurrentStepIndex,
  } = useFlows()
  const { primaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { mergeAppearanceWithDefault } = useTheme()
  const { setOpenFlowState, getOpenFlowState, hasOpenModals } = useFlowOpens()

  const [showModal, setShowModal] = [
    getOpenFlowState(flowId, true),
    (value) => setOpenFlowState(flowId, value),
  ]

  appearance = mergeAppearanceWithDefault(appearance)

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

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

  if (getFlowStatus(flowId) === COMPLETED_FLOW) {
    return null
  }

  if (hasOpenModals()) {
    return null
  }

  const steps = getFlowSteps(flowId)

  const currentStep = steps[getCurrentStepIndex(flowId)]

  const handleClose = () => {
    setShowModal(false)
    if (onDismiss) {
      onDismiss()
    }
    markFlowCompleted(flowId)
  }

  function getContent() {
    return (
      <>
        <RenderInlineStyles appearance={appearance} />
        <AnnouncementContainer
          appearance={appearance}
          className={mergeClasses(getClassName('announcementContainer', appearance), className)}
          style={style}
        >
          {(dismissible === true || currentStep.dismissible) && modalPosition == 'inline' && (
            <DismissButton
              onClick={async () => {
                await markFlowCompleted(flowId)
                if (onDismiss) {
                  onDismiss()
                }
              }}
              className={getClassName('announcementDismissButton', appearance)}
            >
              <Close />
            </DismissButton>
          )}
          <TextContainer>
            <HeaderTitle
              appearance={appearance}
              className={getClassName('announcementTitle', appearance)}
              dangerouslySetInnerHTML={sanitize(currentStep.title)}
            />
            {currentStep.subtitle && (
              <HeaderSubtitle
                appearance={appearance}
                className={getClassName('announcementSubtitle', appearance)}
                dangerouslySetInnerHTML={sanitize(currentStep.subtitle)}
              />
            )}
          </TextContainer>
          {(currentStep.imageUri || currentStep.videoUri) && (
            <MediaContainer className={getClassName('announcementMediaContainer', appearance)}>
              <Media appearance={appearance} stepData={currentStep} />
            </MediaContainer>
          )}
          {currentStep.primaryButtonTitle && (
            <CallToActionContainer className={getClassName('announcementCTAContainer', appearance)}>
              <Button
                classPrefix="announcement"
                title={currentStep.primaryButtonTitle}
                appearance={appearance}
                withMargin={false}
                size="medium"
                type="inline"
                onClick={async () => {
                  currentStep.handlePrimaryButtonClick()
                  primaryCTAClickSideEffects(currentStep)
                  if (onButtonClick) {
                    const result = onButtonClick(
                      currentStep,
                      getCurrentStepIndex(flowId),
                      'primary'
                    )
                    if (result === false) {
                      return
                    }
                  }
                  await markStepCompleted(flowId, currentStep.id)
                  await markFlowCompleted(flowId)
                }}
              />
            </CallToActionContainer>
          )}
        </AnnouncementContainer>
      </>
    )
  }

  const overrideStyle: CSSProperties = {
    padding: '24px',
    maxWidth: '400px',
  }

  if (modalPosition === 'inline') {
    return getContent()
  }

  if (modalPosition !== 'center') {
    return (
      <CornerModal
        modalPosition={modalPosition}
        onClose={handleClose}
        visible={showModal}
        dismissible={dismissible}
        appearance={appearance}
      >
        {getContent()}
      </CornerModal>
    )
  }

  return (
    <Modal
      appearance={appearance}
      onClose={handleClose}
      visible={showModal}
      style={overrideStyle}
      dismissible={dismissible}
    >
      {getContent()}
    </Modal>
  )
}
