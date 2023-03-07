import React, { CSSProperties, FC, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '../components/Button'
import { CloseIcon } from '../components/CloseIcon'
import styled from 'styled-components'
import { getPosition } from './position'
import {
  TooltipContainer,
  TooltipFooter,
  TooltipFooterLeft,
  TooltipFooterRight,
  TooltipHeader,
  TooltipStepCounter,
  TooltipSubtitle,
  TooltipTitle,
} from './styled'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../types'

import { useElemRect } from '@reactour/utils'
import { getClassName } from '../shared/appearance'

export type ToolTipPosition = 'left' | 'right' | 'auto'

const CARD_WIDTH = 385

// TODO: Should extend from FlowItem in a shared types repo
interface TooltipData extends StepData {
  selector?: string
  subtitleStyle?: CSSProperties
  titleStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

export interface ToolTipProps extends DefaultFrigadeFlowProps {
  steps?: TooltipData[]
  onDismiss?: () => void
  onComplete?: () => void
  tooltipPosition?: ToolTipPosition
  showHighlight?: boolean
  /**
   * @deprecated Use `appearance` instead
   */
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
  appearance?: Appearance
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

const DEFAULT_REFRESH_DELAY = 500

const HighlightInner = styled.div<{ primaryColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background-color: ${(props) => props.primaryColor};
  z-index: 20;
  opacity: 1;
`

const HiglightContainer = styled.div<{ primaryColor: string }>`
  width: 32px;
  height: 32px;
  position: absolute;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: 100;
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
  customStepTypes,
  onStepCompletion,
  appearance,
}) => {
  const [selfBounds, setSelfBounds] = useState<undefined | DOMRect>(undefined)
  const [needsUpdate, setNeedsUpdate] = useState(new Date())
  const selfRef = useRef()

  const [elem, setElem] = useState(initialElem)
  const boundingRect = useElemRect(elem, needsUpdate)

  useLayoutEffect(() => {
    if (selfRef.current) {
      setSelfBounds({
        width: selfRef.current.offsetWidth,
        height: selfRef.current.offsetHeight,
      })
    }
  }, [])

  let tooltipPositionValue: ToolTipPosition =
    tooltipPosition === 'auto' ? 'right' : (tooltipPosition as ToolTipPosition)
  let position = getPosition(
    boundingRect,
    tooltipPositionValue,
    selfBounds?.width ?? CARD_WIDTH,
    offset
  )
  const rightSideIsCropped =
    boundingRect.right + CARD_WIDTH > (window.innerWidth || document.documentElement.clientWidth)

  if (rightSideIsCropped && tooltipPosition === 'auto') {
    position = getPosition(boundingRect, 'left', CARD_WIDTH, offset)
    tooltipPositionValue = 'left'
  }

  const url = window.location.pathname.split('/').pop()

  const handleRefreshPosition = () => {
    const elem = document.querySelector(steps[selectedStep].selector)
    setElem(elem)
    setNeedsUpdate(new Date())
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      handleRefreshPosition()
    }, DEFAULT_REFRESH_DELAY)

    handleRefreshPosition()
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
          <TooltipStepCounter className={getClassName('tooltipStepCounter', appearance)}>
            {selectedStep + 1} of {steps.length}
          </TooltipStepCounter>
        </TooltipFooterLeft>
        <TooltipFooterRight>
          <Button
            title={steps[selectedStep].primaryButtonTitle || 'Next'}
            appearance={appearance}
            onClick={handleOnCTAClick}
            style={{
              maxWidth: '50%',
              minWidth: '120px',
              ...buttonStyle,
            }}
          />
          {steps[selectedStep].secondaryButtonTitle && (
            <Button
              title={steps[selectedStep].secondaryButtonTitle}
              appearance={appearance}
              onClick={handleOnSecondaryCTAClick}
              style={{
                width: 'auto',
                marginLeft: '8px',
              }}
              secondary
            />
          )}
        </TooltipFooterRight>
      </>
    )
  }

  const DefaultTooltipStepContent = () => {
    return (
      <>
        <TooltipHeader className={getClassName('tooltipHeader', appearance)}>
          <TooltipTitle
            className={getClassName('tooltipTitle', appearance)}
            appearance={appearance}
          >
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
                color: appearance?.theme?.colorText
              }}
            >
              <CloseIcon />
            </div>
          )}
        </TooltipHeader>
        <div className="Tooltip-Body">
          <TooltipSubtitle
            className={getClassName('tooltipBody', appearance)}
            appearance={appearance}
          >
            {steps[selectedStep].subtitle}
          </TooltipSubtitle>
        </div>
        <TooltipFooter className={getClassName('tooltipFooter', appearance)}>
          <DefaultFooterContent />
        </TooltipFooter>
      </>
    )
  }

  const DEFAULT_CUSTOM_STEP_TYPES = {
    default: (stepData: StepData) => {
      if (steps[selectedStep]?.StepContent) {
        const Content: React.ReactNode = steps[selectedStep].StepContent
        return <div>{Content}</div>
      }

      return <DefaultTooltipStepContent />
    },
  }

  const mergedCustomStepTypes = { ...DEFAULT_CUSTOM_STEP_TYPES, ...customStepTypes }

  const StepContent = () => {
    if (!steps) return <></>
    if (!steps[selectedStep]?.type || !mergedCustomStepTypes[steps[selectedStep].type]) {
      return mergedCustomStepTypes['default'](steps[selectedStep])
    }
    return mergedCustomStepTypes[steps[selectedStep].type]({
      stepData: steps[selectedStep],
      primaryColor: primaryColor,
    })
  }

  return (
    <>
      {showHighlight && (
        <HiglightContainer
          style={{
            top: position?.y - 24 ?? 0,
            left: (tooltipPositionValue == 'left' ? boundingRect.x : position?.x - 24) ?? 0,
          }}
        >
          <HighlightInner
            style={{
              position: 'absolute',
            }}
            primaryColor={appearance.theme.colorPrimary}
          ></HighlightInner>
          <HighlightOuter
            style={{
              position: 'relative',
            }}
            primaryColor={appearance.theme.colorPrimary}
          ></HighlightOuter>
        </HiglightContainer>
      )}
      <TooltipContainer
        ref={selfRef}
        layoutId="tooltip-container"
        style={{
          position: 'absolute',
          width: 'max-content',
          left: `${position?.x}px` ?? 0,
          top: `${position?.y}px` ?? 0,
          ...containerStyle,
        }}
        appearance={appearance}
        className={getClassName('tooltipContainer', appearance)}
        maxWidth={CARD_WIDTH}
      >
        <StepContent />
      </TooltipContainer>
    </>
  )
}

export default Tooltips
