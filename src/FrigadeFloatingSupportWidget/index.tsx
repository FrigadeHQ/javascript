import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react'

import { Appearance, StepData } from '../types'
import { useFlows } from '../api/flows'
import { Portal } from 'react-portal'
import {
  FloatingWidgetButton,
  FloatingWidgetContainer,
  FloatingWidgetMenu,
  FlowWidgetMenuItem,
} from './styled'
import { AnimatePresence, motion } from 'framer-motion'
import { primaryCTAClickSideEffects } from '../shared/cta-util'
import { Question } from '../components/Icons/Question'
import { getClassName } from '../shared/appearance'

export interface FloatingWidgetProps {
  primaryColor?: string
  backgroundColor?: string
  style?: CSSProperties
  flowId: string
  onStepCompletion?: (step: StepData, index: number) => boolean
  className?: string
  visible?: boolean
  appearance?: Appearance
}

export const FrigadeFloatingSupportWidget: FC<FloatingWidgetProps> = ({
  flowId,
  style,
  className = '',
  onStepCompletion,
  visible = true,
  appearance,
}) => {
  const {
    getFlow,
    getFlowSteps,
    markStepCompleted,
    getStepStatus,
    getNumberOfStepsCompleted,
    isLoading,
    targetingLogicShouldHideFlow,
  } = useFlows()
  const wrapperRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false)

  // below is the same as componentDidMount and componentDidUnmount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowMenu(false)
    }
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

  const steps: StepData[] = getFlowSteps(flowId)
  if (!steps) {
    return null
  }

  if (!visible) {
    return null
  }

  function handlePrimaryButtonClick(step: StepData, index: number) {
    if (
      !step.completionCriteria &&
      (step.autoMarkCompleted || step.autoMarkCompleted === undefined)
    ) {
      markStepCompleted(flowId, step.id)
    }
    primaryCTAClickSideEffects(step)
    if (onStepCompletion) {
      onStepCompletion(step, index)
    }
    setShowMenu(false)
  }

  return (
    <Portal>
      <FloatingWidgetContainer ref={wrapperRef}>
        <AnimatePresence>
          {showMenu && (
            <FloatingWidgetMenu
              classes={getClassName('floatingWidgetMenu', appearance)}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {steps.map((step, index) => (
                <FlowWidgetMenuItem
                  className={getClassName('floatingWidgetMenuItem', appearance)}
                  key={index}
                  onClick={() => handlePrimaryButtonClick(step, index)}
                >
                  {step.title}
                </FlowWidgetMenuItem>
              ))}
            </FloatingWidgetMenu>
          )}
        </AnimatePresence>
        <FloatingWidgetButton
          onClick={() => {
            setShowMenu(!showMenu)
          }}
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          className={getClassName('floatingWidgetButton', appearance)}
        >
          <Question
            className={getClassName('floatingWidgetMenu', appearance)}
            style={{ display: 'flex', width: '20px', height: '20px' }}
          />
        </FloatingWidgetButton>
      </FloatingWidgetContainer>
    </Portal>
  )
}

export default FrigadeFloatingSupportWidget
