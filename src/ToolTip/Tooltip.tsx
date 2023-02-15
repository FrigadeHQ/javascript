import React, { CSSProperties, FC, useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { CloseIcon } from '../components/CloseIcon'

import styled, { keyframes } from 'styled-components'
import { getPosition } from './position'
import {
  TooltipFooterLeft,
  TooltipStepCounter,
  TooltipFooterRight,
  TooltipContainer,
  TooltipHeader,
  TooltipTitle,
  TooltipFooter,
  Wrapper,
} from './styled'
import { StepData } from '../types'

export type ToolTipPosition = 'left' | 'right'

const CARD_WIDTH = 385

// TODO: Should extend from FlowItem in a shared types repo
interface TooltipData extends StepData {
  subtitleStyle?: CSSProperties
  titleStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

interface ToolTipProps {
  data: TooltipData | TooltipData[]
  onDismiss: () => void
  onNext: (idx: number) => void
  onComplete: () => void
  tooltipPosition?: ToolTipPosition
  ref?: any
  showHighlight?: boolean
  primaryColor?: string
  buttonStyle?: CSSProperties
}

const breatheAnimation = keyframes`
 0% { opacity: 0.15; }
 50% { opacity: 0.35 }
 100% { opacity: 0.15; }
`

const HighlightOuter = styled.div<{ primaryColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  background-color: ${(props: any) => props.primaryColor};
  opacity: 0.2;
  animation-name: ${breatheAnimation};
  animation-duration: 4s;
  animation-iteration-count: infinite;
`

const HighlightInner = styled.div<{ primaryColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background-color: ${(props) => props.primaryColor};
  z-index: 20;
  opacity: 0.8;
`

const Tooltip: FC<ToolTipProps> = React.forwardRef<HTMLElement, ToolTipProps>(
  (
    {
      data,
      onDismiss,
      onNext,
      onComplete,
      tooltipPosition = 'left',
      showHighlight = true,
      primaryColor = '#000000',
      buttonStyle = {},
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [currentStepData, setCurrentStepData] = useState<TooltipData>()

    const [isVisible, setVisible] = useState(true)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 })

    const handlePositioningUpdate = () => {
      if (!ref) return
      if (typeof ref === 'function') {
        console.error(
          'Tooltip can not handle function ref. Please pass in HTML Element ref instead'
        )
        return
      }
      const anchorBounds = (ref.current as any)?.getBoundingClientRect()
      setPosition(getPosition(anchorBounds, tooltipPosition, CARD_WIDTH, { x: 0, y: 20 }))
      setHighlightPosition(
        getPosition(anchorBounds, tooltipPosition, CARD_WIDTH, { x: -40, y: 20 })
      )
    }

    useEffect(() => {
      if (!Array.isArray(data)) {
        setCurrentStepData(data)
        handlePositioningUpdate()
        return
      }
      setCurrentStepData(data[currentStep])
      handlePositioningUpdate()
    }, [currentStep])

    const handleOnCTAClick = () => {
      if (!Array.isArray(data) || currentStep === data.length - 1) {
        setVisible(false)
        return onComplete()
      } else {
        onNext(currentStep)
        setCurrentStep(currentStep + 1)
      }
    }

    if (!isVisible || !currentStepData) return <></>

    const FooterContent = () => {
      if (!Array.isArray(data)) {
        return <Button title={currentStepData.primaryButtonTitle} onClick={handleOnCTAClick} />
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
              title={currentStepData.primaryButtonTitle || 'Next'}
              onClick={handleOnCTAClick}
              style={{ backgroundColor: primaryColor, borderColor: primaryColor, ...buttonStyle }}
            />
          </TooltipFooterRight>
        </>
      )
    }

    return (
      <Wrapper>
        {showHighlight && (
          <>
            <HighlightInner
              style={{
                position: 'absolute',
                top: highlightPosition?.y - 10 ?? 0,
                left: highlightPosition?.x - 10 ?? 0,
              }}
              primaryColor={primaryColor}
            ></HighlightInner>
            <HighlightOuter
              style={{
                position: 'absolute',
                top: highlightPosition?.y - 24 ?? 0,
                left: highlightPosition?.x - 24 ?? 0,
              }}
              primaryColor={primaryColor}
            ></HighlightOuter>
          </>
        )}
        <TooltipContainer
          style={{
            position: 'absolute',
            top: position?.y ?? 0,
            left: position?.x ?? 0,
            width: 'max-content',
          }}
          maxWidth={CARD_WIDTH}
        >
          <TooltipHeader>
            <TooltipTitle style={{ fontSize: '18px', fontWeight: '600' }}>
              {currentStepData.title}
            </TooltipTitle>
            {onDismiss && (
              <div
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
            <p style={{ fontSize: '16px', fontWeight: '400' }}>{currentStepData.subtitle}</p>
          </div>
          <TooltipFooter>
            <FooterContent />
          </TooltipFooter>
        </TooltipContainer>
      </Wrapper>
    )
  }
)

export default Tooltip
