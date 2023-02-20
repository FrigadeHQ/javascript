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
  data: TooltipData | TooltipData[]
  onDismiss: () => void
  onNext: (stepId: string) => void
  onComplete: () => void
  tooltipPosition?: ToolTipPosition
  showHighlight?: boolean
  primaryColor?: string
  buttonStyle?: CSSProperties

  elem?: any // initial element to focus
  offset?: { x: number; y: number }
  visible?: boolean
  initialStep?: number
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

const Tooltip: FC<ToolTipProps> = ({
  data,
  onDismiss,
  onNext,
  onComplete,
  tooltipPosition = 'left',
  showHighlight = true,
  primaryColor = '#000000',
  buttonStyle = {},
  elem: initialElem,
  offset = { x: 0, y: 0 },
  visible = true,
  initialStep = 0
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const [elem, setElem] = useState(initialElem)
  const boundingRect = useElemRect(elem, currentStep)
  const position = getPosition(boundingRect, tooltipPosition, CARD_WIDTH, offset)

  useEffect(() => {
    if (!Array.isArray(data)) {
      return
    }
    setElem(document.querySelector(data[currentStep].selector))
  }, [currentStep])

  if (!visible) return <></>

  const DefaultFooterContent = () => {

    const handleOnCTAClick = () => {
      if (!Array.isArray(data) || currentStep === data.length - 1) {
        return onComplete()
      } else {
        onNext(data[currentStep].id)
        setCurrentStep(currentStep + 1)
      }
    }
  
    const handleOnSecondaryCTAClick = () => {
      if(data[currentStep].handleSecondaryCTAClick) {
        data[currentStep].handleSecondaryCTAClick()
      }
      else {
        setCurrentStep(currentStep + 1)
      }
    }
  
  
    if (!Array.isArray(data)) {
      return <Button title={data[currentStep].primaryButtonTitle} onClick={handleOnCTAClick} />
    }
  
    return (
      <>
        <TooltipFooterLeft>
          <TooltipStepCounter>
            {currentStep + 1} of {data.length}
          </TooltipStepCounter>
        </TooltipFooterLeft>
        <TooltipFooterRight>
          <Button
            title={data[currentStep].primaryButtonTitle || 'Next'}
            onClick={handleOnCTAClick}
            style={{ backgroundColor: primaryColor, borderColor: primaryColor, maxWidth: '50%', ...buttonStyle }}
          />
          {
            data[currentStep].secondaryButtonTitle && (
              <Button
                title={data[currentStep].secondaryButtonTitle}
                onClick={handleOnSecondaryCTAClick}
                style={{ borderColor: primaryColor, width: 'auto', backgroundColor: '#FFFFFF', marginLeft: '8px' }}
                textStyle={{ color: primaryColor }}
              />
            )
          }
        </TooltipFooterRight>
      </>
    )
  }

  const DefaultTooltipStepContent = () => {
    return (
      <>
        <TooltipHeader>
          <TooltipTitle style={{ fontSize: '18px', fontWeight: '600' }}>
            {data[currentStep].title}
          </TooltipTitle>
          {onDismiss && (
            <div
              data-testid='tooltip-dismiss'
              onClick={onDismiss}
              style={{
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <CloseIcon />
            </div>
          )}
        </TooltipHeader>
        <div className="Tooltip-Body">
          <p style={{ fontSize: '16px', fontWeight: '400' }}>{data[currentStep].subtitle}</p>
        </div>
        <TooltipFooter>
          <DefaultFooterContent />
        </TooltipFooter>
      </>
    )
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
            position: 'absolute',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <HighlightInner
            style={{
              position: 'absolute',
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
          position: 'absolute',
          width: 'max-content',
          left: position?.x ?? 0,
          top: position?.y ?? 0,
        }}
        maxWidth={CARD_WIDTH}
      >
        <DefaultTooltipStepContent />
      </TooltipContainer>
    </Wrapper>
  )
}

export default Tooltip
