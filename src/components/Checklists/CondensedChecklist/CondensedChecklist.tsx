import React, { FC, useEffect, useState } from 'react'
import { StepData } from '../../../types'
import { Modal } from '../../Modal'
import { ProgressBar } from '../Checklist/Progress'
import { CollapsibleStep } from './CollapsibleStep'

import {
  ChecklistContainer,
  CondensedInlineChecklistContainer,
  HeaderContent,
  ModalChecklistSubtitle,
  ModalChecklistTitle,
} from './styled'
import { sanitize } from '../../../shared/sanitizer'
import { getClassName, mergeClasses } from '../../../shared/appearance'
import { FrigadeChecklistProps } from '../../../FrigadeChecklist'

export interface CondensedChecklistProps extends Omit<FrigadeChecklistProps, 'flowId'> {
  autoCollapse?: boolean
  onClose: () => void
}

const CondensedChecklist: FC<CondensedChecklistProps> = ({
  title,
  subtitle,
  steps,
  onClose,
  visible,
  onCompleteStep,
  autoExpandFirstIncompleteStep = true,
  autoCollapse = true,
  autoExpandNextStep = true,
  primaryColor = '#000000',
  selectedStep,
  setSelectedStep,
  appearance,
  type,
  className,
  customStepTypes,
}) => {
  const completeCount = steps.filter((s) => s.complete).length
  const [collapsedSteps, setCollapsedSteps] = useState<boolean[]>(Array(steps.length).fill(true))

  useEffect(() => {
    const initCollapsedState = [...collapsedSteps]
    if (!autoExpandFirstIncompleteStep) return
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].complete) {
        initCollapsedState[i] = false
        break
      }
    }
    setCollapsedSteps(initCollapsedState)
  }, [])

  useEffect(() => {
    handleStepClick(selectedStep)
  }, [selectedStep])

  const handleStepClick = (idx: number) => {
    const newCollapsedState = [...collapsedSteps]
    if (autoCollapse) {
      for (let i = 0; i < collapsedSteps.length; ++i) {
        if (i !== idx) {
          newCollapsedState[i] = true
        }
      }
    }
    newCollapsedState[idx] = !newCollapsedState[idx]
    setCollapsedSteps(newCollapsedState)
  }

  if (!visible && type == 'modal') return <></>

  const headerContent = (
    <>
      <HeaderContent>
        <ModalChecklistTitle
          appearance={appearance}
          className={getClassName('checklistTitle', appearance)}
          dangerouslySetInnerHTML={sanitize(title)}
        />
        <ModalChecklistSubtitle
          appearance={appearance}
          className={getClassName('checklistSubtitle', appearance)}
          dangerouslySetInnerHTML={sanitize(subtitle)}
        />
      </HeaderContent>
      <ProgressBar
        display="percent"
        count={completeCount}
        total={steps.length}
        fillColor={primaryColor}
        style={{ margin: '14px 0px 8px 0px' }}
        appearance={appearance}
      />
    </>
  )

  const checklistContent = (
    <ChecklistContainer
      className={mergeClasses(getClassName('checklistContainer', appearance), className)}
    >
      {steps.map((step: StepData, idx: number) => {
        const isCollapsed = collapsedSteps[idx]
        return (
          <CollapsibleStep
            appearance={appearance}
            stepData={step}
            collapsed={isCollapsed}
            key={`modal-checklist-${step.id ?? idx}`}
            onClick={() => {
              if (selectedStep === idx) {
                // Collapse step if needed
                handleStepClick(idx)
                return
              }
              setSelectedStep(idx)
            }}
            onPrimaryButtonClick={() => {
              if (onCompleteStep) {
                onCompleteStep(idx, step)
              }
              if (step.handlePrimaryButtonClick) {
                step.handlePrimaryButtonClick()
              }
              if (!autoExpandNextStep) return
              // Automatically expand next step
              if (
                !step.completionCriteria &&
                idx < collapsedSteps.length - 1 &&
                collapsedSteps[idx + 1]
              ) {
                setSelectedStep(idx + 1)
              }
            }}
            onSecondaryButtonClick={() => {
              if (step.handleSecondaryButtonClick) {
                step.handleSecondaryButtonClick()
              }
            }}
            customStepTypes={customStepTypes}
          />
        )
      })}
    </ChecklistContainer>
  )

  if (type === 'inline') {
    return (
      <CondensedInlineChecklistContainer
        appearance={appearance}
        className={mergeClasses(getClassName('checklistInlineContainer', appearance), className)}
      >
        {headerContent}
        {checklistContent}
      </CondensedInlineChecklistContainer>
    )
  }

  return (
    <>
      <Modal
        onClose={onClose}
        visible={visible}
        appearance={appearance}
        style={{ maxWidth: '600px' }}
        headerContent={headerContent}
      >
        {checklistContent}
      </Modal>
    </>
  )
}

export default CondensedChecklist
