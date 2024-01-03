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
  PaginationContainer,
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
import { useFlowImpressions } from '../hooks/useFlowImpressions'
import { FormPagination } from '../FrigadeForm/FormPagination'

export interface FrigadeAnnouncementProps extends DefaultFrigadeFlowProps {
  dismissible?: boolean
  /**
   * Indicates the position of the modal if the form type is a modal. Default is center.
   */
  modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'inline'
  /**
   * Show a pagination indicator at the bottom of the announcement when using more than 1 page. Default is true.
   */
  showPagination?: boolean
  /**
   * Whether to allow the user to navigate back to previous steps. Default is false.
   * The title of the button can be controlled by the `backButtonTitle` prop on the step.
   */
  allowBackNavigation?: boolean
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
  modalPosition = 'center',
  showPagination = true,
  allowBackNavigation,
}) => {
  const {
    getFlow,
    markFlowCompleted,
    markFlowSkipped,
    markStepCompleted,
    markStepStarted,
    isLoading,
    targetingLogicShouldHideFlow,
    updateCustomVariables,
    getFlowSteps,
    getFlowStatus,
    getCurrentStepIndex,
  } = useFlows()
  const { primaryCTAClickSideEffects, secondaryCTAClickSideEffects } = useCTAClickSideEffects()
  const { mergeAppearanceWithDefault } = useTheme()
  const { setOpenFlowState, getOpenFlowState, hasOpenModals } = useFlowOpens()
  useFlowImpressions(flowId)

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
  const currentStepIndex = getCurrentStepIndex(flowId)
  const totalSteps = steps.length

  const currentStep = steps[currentStepIndex]

  if (!currentStep) {
    return null
  }

  const handleClose = async () => {
    setShowModal(false)
    await markFlowSkipped(flowId)
    if (onDismiss) {
      onDismiss()
    }
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
                await markFlowSkipped(flowId)
                if (onDismiss) {
                  onDismiss()
                }
              }}
              className={getClassName('announcementDismissButton', appearance)}
            >
              <Close />
            </DismissButton>
          )}
          <TextContainer className={getClassName('announcementTextContainer', appearance)}>
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

          {showPagination && totalSteps > 1 && (
            <PaginationContainer
              className={getClassName('announcementPaginationContainer', appearance)}
            >
              <FormPagination
                className={getClassName('announcementPagination', appearance)}
                appearance={appearance}
                stepCount={totalSteps}
                currentStep={currentStepIndex}
              />
            </PaginationContainer>
          )}
          {(currentStep.primaryButtonTitle || currentStep.secondaryButtonTitle) && (
            <CallToActionContainer
              allowBackNavigation={allowBackNavigation}
              className={getClassName('announcementCTAContainer', appearance)}
            >
              {allowBackNavigation && currentStepIndex > 0 && (
                <Button
                  classPrefix="announcementBack"
                  title={currentStep.backButtonTitle ?? 'Back'}
                  appearance={appearance}
                  withMargin={false}
                  size="small"
                  type="full-width"
                  onClick={async () => {
                    if (onButtonClick) {
                      onButtonClick(currentStep, getCurrentStepIndex(flowId), 'back')
                    }
                    await markStepStarted(flowId, steps[currentStepIndex - 1].id)
                  }}
                  secondary
                />
              )}
              {currentStep.secondaryButtonTitle && (
                <Button
                  classPrefix="announcement"
                  title={currentStep.secondaryButtonTitle}
                  appearance={appearance}
                  withMargin={false}
                  size="small"
                  type="full-width"
                  onClick={async () => {
                    currentStep.handleSecondaryButtonClick()
                    secondaryCTAClickSideEffects(currentStep)
                    if (onButtonClick) {
                      onButtonClick(currentStep, getCurrentStepIndex(flowId), 'secondary')
                    }
                  }}
                  secondary
                />
              )}
              {currentStep.primaryButtonTitle && (
                <Button
                  classPrefix="announcement"
                  title={currentStep.primaryButtonTitle}
                  appearance={appearance}
                  withMargin={false}
                  size="small"
                  type={'full-width'}
                  onClick={async () => {
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
                    if (getCurrentStepIndex(flowId) === totalSteps - 1) {
                      currentStep.handlePrimaryButtonClick()
                      await markFlowCompleted(flowId)
                    } else {
                      currentStep.handlePrimaryButtonClick()
                    }
                  }}
                />
              )}
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
