import React, { FC, useEffect, useState } from 'react'
import { StepData } from '../../types'
import { Modal } from '../../components/Modal'
import { ProgressBar } from '../Checklist/Progress'
import { CollapsibleStep } from './CollapsibleStep'

import { HeaderContent, ModalChecklistSubtitle, ModalChecklistTitle } from './styled'

interface ModalChecklistProps {
  steps: StepData[]
  title: string
  subtitle: string
  onClose: () => void
  visible: boolean
  onCompleteStep?: (index: number, stepData: StepData) => void
  autoCollapse?: boolean
  autoExpandFirstIncompleteStep?: boolean
  autoExpandNextStep?: boolean
  primaryColor?: string
  selectedStep?: number
  setSelectedStep?: (index: number) => void
}

const ModalChecklist: FC<ModalChecklistProps> = ({
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

  if (!visible) return <></>

  return (
    <>
      <Modal
        onClose={onClose}
        visible={visible}
        headerContent={
          <>
            <HeaderContent>
              <ModalChecklistTitle>{title}</ModalChecklistTitle>
              <ModalChecklistSubtitle>{subtitle}</ModalChecklistSubtitle>
            </HeaderContent>
            <ProgressBar
              display="percent"
              count={completeCount}
              total={steps.length}
              fillColor={primaryColor}
              style={{ margin: '14px 0px 8px 0px' }}
            />
          </>
        }
        style={{ maxWidth: '600px' }}
      >
        {steps.map((step: StepData, idx: number) => {
          const isCollapsed = collapsedSteps[idx]
          return (
            <CollapsibleStep
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
              primaryColor={primaryColor}
            />
          )
        })}
      </Modal>
    </>
  )
}

export default ModalChecklist
