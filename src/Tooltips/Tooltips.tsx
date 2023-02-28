import React, { CSSProperties, FC, useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { CloseIcon } from '../components/CloseIcon'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { getPosition } from './position'
import {
  TooltipContainer,
  TooltipFooter,
  TooltipFooterLeft,
  TooltipFooterRight,
  TooltipHeader,
  TooltipStepCounter,
  TooltipTitle,
  Wrapper,
} from './styled'
import { StepData } from '../types'

import { useElemRect } from '@reactour/utils'

export type ToolTipPosition = 'left' | 'right'

const CARD_WIDTH = 385

// TODO: Should extend from FlowItem in a shared types repo
interface TooltipData extends StepData {
  selector?: string
  subtitleStyle?: CSSProperties
  titleStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

export interface ToolTipProps {
  steps?: TooltipData[]
  onDismiss?: () => void
  onComplete?: () => void
  tooltipPosition?: ToolTipPosition
  showHighlight?: boolean
  primaryColor?: string
  buttonStyle?: CSSProperties

  elem?: any // initial element to focus
  offset?: { x: number; y: number }
  visible?: boolean
  initialStep?: number
  containerStyle?: CSSProperties
  customVariables?: { [key: string]: string | number | boolean }
  selectedStep?: number
  setSelectedStep?: (index: number) => void
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>
}

const HighlightOuter = styled.div<{ primaryColor: string }>`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  position: absolute;
  display: inline-flex;
  background-color: ${(props: any) => props.primaryColor};
  animation-duration: 1.5s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-delay: 0.15s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: ping;
  opacity: 0.15;

  @keyframes ping {
    75%,
    to {
      transform: scale(1.75);
      opacity: 0;
    }
  }
`

const HighlightInner = styled.div<{ primaryColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background-color: ${(props) => props.primaryColor};
  z-index: 20;
  opacity: 1;
`

const Tooltips: FC<ToolTipProps> = ({
  steps = [],
  onDismiss,
  onComplete = () => {},
  tooltipPosition = 'left',
  showHighlight = true,
  primaryColor = '#000000',
  buttonStyle = {},
  elem: initialElem,
  offset = { x: 0, y: 0 },
  visible = true,
  initialStep = 0,
  containerStyle = {},
  selectedStep = 0,
  setSelectedStep = () => {},
  customStepTypes
}) => {
  const [elem, setElem] = useState(initialElem)  
  const boundingRect = useElemRect(elem, selectedStep)
  const position = getPosition(boundingRect, tooltipPosition, CARD_WIDTH, offset)

  const url = window.location.pathname.split('/').pop();

  useEffect(() => {
    const elem = document.querySelector(steps[selectedStep].selector)
    setElem(elem)
  }, [selectedStep, url])


  if (elem === null) {
    return <></>
  }

  if (!visible) return <></>

  const DefaultFooterContent = () => {
    const handleOnCTAClick = () => {
      if (steps[selectedStep].handlePrimaryButtonClick) {
        steps[selectedStep].handlePrimaryButtonClick()
      }
      if (selectedStep === steps.length - 1) {
        return onComplete()
      }
    }

    const handleOnSecondaryCTAClick = () => {
      if (steps[selectedStep].handleSecondaryButtonClick) {
        steps[selectedStep].handleSecondaryButtonClick()
      }
    }

    return (
      <>
        <TooltipFooterLeft>
          <TooltipStepCounter>
            {selectedStep + 1} of {steps.length}
          </TooltipStepCounter>
        </TooltipFooterLeft>
        <TooltipFooterRight>
          <Button
            title={steps[selectedStep].primaryButtonTitle || 'Next'}
            onClick={handleOnCTAClick}
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              maxWidth: '50%',
              ...buttonStyle,
            }}
          />
          {steps[selectedStep].secondaryButtonTitle && (
            <Button
              title={steps[selectedStep].secondaryButtonTitle}
              onClick={handleOnSecondaryCTAClick}
              style={{
                borderColor: primaryColor,
                width: 'auto',
                backgroundColor: '#FFFFFF',
                marginLeft: '8px',
              }}
              textStyle={{ color: primaryColor }}
            />
          )}
        </TooltipFooterRight>
      </>
    )
  }

  const DefaultTooltipStepContent = () => {
    return (
      <>
        <TooltipHeader>
          <TooltipTitle style={{ fontSize: '18px', fontWeight: '600' }}>
            {steps[selectedStep].title}
          </TooltipTitle>
          {onDismiss && (
            <div
              data-testid="tooltip-dismiss"
              onClick={onDismiss}
              style={{
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                display: 'flex',
                cursor: 'pointer',
              }}
            >
              <CloseIcon />
            </div>
          )}
        </TooltipHeader>
        <div className="Tooltip-Body">
          <p style={{ fontSize: '16px', fontWeight: '400' }}>{steps[selectedStep].subtitle}</p>
        </div>
        <TooltipFooter>
          <DefaultFooterContent />
        </TooltipFooter>
      </>
    )
  }

  const DEFAULT_CUSTOM_STEP_TYPES = {
    'default':
    (stepData: StepData) => {
      if (steps[selectedStep]?.StepContent) {
        const Content: React.ReactNode = steps[selectedStep].StepContent
        return <div>{Content}</div>
      }

      return (
        <DefaultTooltipStepContent />
      )
    },
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  const StepContent = () => {
    if(!steps) return <></>
    if (!steps[selectedStep]?.type || !mergedCustomStepTypes[steps[selectedStep].type]) {
      return mergedCustomStepTypes['default'](steps[selectedStep])
    }
    return mergedCustomStepTypes[steps[selectedStep].type]({
      stepData: steps[selectedStep],
      primaryColor: primaryColor,
    })
  }

  return (
    <Wrapper>
      {showHighlight && (
        <span
          style={{
            width: 32,
            height: 32,
            top: position?.y - 24 ?? 0,
            left: position?.x - 24 ?? 0,
            position: 'fixed',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <HighlightInner
            style={{
              position: 'fixed',
              // top: position?.y - 10 ?? 0,
              // left: position?.x - 10 ?? 0,
            }}
            primaryColor={primaryColor}
          ></HighlightInner>
          <HighlightOuter
            style={{
              position: 'relative',
              // top: position?.y - 24 ?? 0,
              // left: position?.x - 24 ?? 0,
            }}
            primaryColor={primaryColor}
          ></HighlightOuter>
        </span>
      )}
      <TooltipContainer
        as={motion.div}
        layoutId="tooltip-container"
        style={{
          position: 'fixed',
          width: 'max-content',
          left: position?.x ?? 0,
          top: position?.y ?? 0,
          ...containerStyle
        }}
        maxWidth={CARD_WIDTH}
      >
       <StepContent />
      </TooltipContainer>
    </Wrapper>
  )
}

export default Tooltips
