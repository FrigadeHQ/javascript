import React, { FC, useEffect, useState } from 'react'
import { StepData } from '../../../types'
import { Modal } from '../../Modal'
import { ProgressBar } from '../Checklist/ProgressBar'
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
  autoExpandFirstIncompleteStep = true,
  autoCollapse = true,
  autoExpandNextStep = true,
  setSelectedStep,
  appearance,
  type,
  className,
  customStepTypes,
  style,
  onButtonClick,
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

  const handleStepClick = (idx: number) => {
    const newCollapsedState = [...collapsedSteps]
    if (autoCollapse) {
      for (let i = 0; i < collapsedSteps.length; ++i) {
        if (i != idx && newCollapsedState[idx]) {
          newCollapsedState[i] = true
        }
      }
    }
    newCollapsedState[idx] = !collapsedSteps[idx]
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
              handleStepClick(idx)
              setSelectedStep(idx)
              if (onButtonClick) {
                onButtonClick(steps[idx], idx, collapsedSteps[idx] ? 'expand' : 'collapse')
              }
            }}
            onPrimaryButtonClick={() => {
              handleStepClick(idx)
              if (autoExpandNextStep && idx < steps.length - 1) {
                setSelectedStep(idx + 1)
              }
              if (step.handlePrimaryButtonClick) {
                step.handlePrimaryButtonClick()
              }
              if (autoExpandNextStep && idx < steps.length - 1) {
                handleStepClick(idx + 1)
              }
            }}
            onSecondaryButtonClick={() => {
              if (step.handleSecondaryButtonClick) {
                step.handleSecondaryButtonClick()
              }
              if (autoExpandNextStep && idx < steps.length - 1) {
                handleStepClick(idx + 1)
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
        style={style}
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
