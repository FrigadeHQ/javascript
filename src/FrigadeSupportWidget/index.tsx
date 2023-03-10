import React, { FC, useEffect, useRef, useState } from 'react'

import { DefaultFrigadeFlowProps, mergeAppearanceWithDefault, StepData } from '../types'
import { useFlows } from '../api/flows'
import { Portal } from 'react-portal'
import {
  FloatingWidgetButton,
  FloatingWidgetContainer,
  FloatingWidgetMenu,
  FlowWidgetMenuItem,
  SupportButton,
  SupportIconContainer,
  SupportTitle,
} from './styled'
import { AnimatePresence, motion } from 'framer-motion'
import { primaryCTAClickSideEffects } from '../shared/cta-util'
import { Question } from '../components/Icons/Question'
import { getClassName } from '../shared/appearance'
import { QuestionCircle } from '../components/Icons/QuestionCircle'

export interface FloatingWidgetProps extends DefaultFrigadeFlowProps {
  type?: 'floating' | 'inline'
  visible?: boolean
  title?: string
}

export const FrigadeSupportWidget: FC<FloatingWidgetProps> = ({
  flowId,
  style,
  className = '',
  onStepCompletion,
  visible = true,
  type = 'inline',
  title = 'Help',
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

  appearance = mergeAppearanceWithDefault(appearance)

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

  function Menu() {
    return (
      showMenu && (
        <FloatingWidgetMenu
          className={getClassName('floatingWidgetMenu', appearance)}
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          type={type}
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
      )
    )
  }

  if (type == 'inline') {
    return (
      <span ref={wrapperRef}>
        <SupportButton
          onClick={() => {
            setShowMenu(!showMenu)
          }}
          className={getClassName('supportButton', appearance)}
        >
          <SupportIconContainer>
            <QuestionCircle
              className={getClassName('supportIcon', appearance)}
              style={{ width: '18px', height: '18px' }}
            />
          </SupportIconContainer>
          <SupportTitle>{title}</SupportTitle>
        </SupportButton>
        <AnimatePresence>
          <Menu />
        </AnimatePresence>
      </span>
    )
  }

  return (
    <Portal>
      <FloatingWidgetContainer ref={wrapperRef}>
        <AnimatePresence>
          <Menu />
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
            className={getClassName('floatingWidgetButtonIcon', appearance)}
            style={{ display: 'flex', width: '20px', height: '20px' }}
          />
        </FloatingWidgetButton>
      </FloatingWidgetContainer>
    </Portal>
  )
}

export default FrigadeSupportWidget
