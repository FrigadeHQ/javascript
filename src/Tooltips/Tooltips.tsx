import React, { CSSProperties, FC, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '../components/Button'
import { Close } from '../components/Icons/Close'
import styled from 'styled-components'
import { getPosition } from './position'
import {
  TooltipContainer,
  TooltipCTAContainer,
  TooltipDismissContainer,
  TooltipFooter,
  TooltipStepCountContainer,
  TooltipStepCounter,
} from './styled'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../types'

import { useElemRect } from '@reactour/utils'
import { getClassName } from '../shared/appearance'
import { TitleSubtitle } from '../components/TitleSubtitle/TitleSubtitle'

export type ToolTipPosition = 'left' | 'right' | 'auto'

const CARD_WIDTH = 300
const CARD_HEIGHT = 50

// TODO: Should extend from FlowItem in a shared types repo
export interface ToolTipData extends StepData {
  selector?: string
  subtitleStyle?: CSSProperties
  titleStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

export interface ToolTipProps extends Omit<DefaultFrigadeFlowProps, 'flowId'> {
  steps?: ToolTipData[]
  onDismiss?: () => void
  onComplete?: () => void
  tooltipPosition?: ToolTipPosition
  showHighlight?: boolean
  showTooltipsSimultaneously?: boolean
  buttonStyle?: CSSProperties

  elem?: any // initial element to focus
  offset?: { x: number; y: number }
  visible?: boolean
  containerStyle?: CSSProperties
  customVariables?: { [key: string]: string | number | boolean }
  selectedStep?: number
  customStepTypes?: Map<string, (stepData: StepData) => React.ReactNode>
  appearance?: Appearance
  /**
   * Shows a close button in the top right corner of the tooltip. This will end the flow.
   */
  dismissible?: boolean
  primaryColor?: string
  /**
   * If true, the tooltip will only show the highlight and not the tooltip itself.
   * Clicking the highlight will reveal it.
   */
  showHighlightOnly?: boolean
  /**
   * If true, a step counter will show up in the tooltip.
   */
  showStepCount?: boolean
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

function useInterval(param: () => void, number: number) {
  const callback = useRef(param)

  // Remember the latest callback.
  useEffect(() => {
    callback.current = param
  }, [param])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      callback.current()
    }
    if (number !== null) {
      let id = setInterval(tick, number)
      return () => clearInterval(id)
    }
  }, [number])
}

const Tooltips: FC<ToolTipProps> = ({
  steps = [],
  onDismiss,
  onComplete = () => {},
  tooltipPosition = 'auto',
  showHighlight = true,
  primaryColor = '#000000',
  buttonStyle = {},
  elem: initialElem,
  offset = { x: 0, y: 0 },
  visible = true,
  containerStyle = {},
  selectedStep = 0,
  customStepTypes,
  onStepCompletion,
  appearance,
  showTooltipsSimultaneously = false,
  dismissible = false,
  showHighlightOnly = false,
  showStepCount = true,
}) => {
  const [selfBounds, setSelfBounds] = useState<undefined | Partial<DOMRect>>(undefined)
  const [needsUpdate, setNeedsUpdate] = useState(new Date())
  const selfRef = useRef(null)

  const [elem, setElem] = useState(initialElem)
  const boundingRect = useElemRect(elem, needsUpdate)
  const [lastBoundingRect, setLastBoundingRect] = useState<string>()
  const [showTooltipContainer, setShowTooltipContainer] = useState(!showHighlightOnly)

  useLayoutEffect(() => {
    if (selfRef.current) {
      setSelfBounds({
        width: selfRef.current.clientWidth,
        height: selfRef.current.clientHeight,
      })
    }
  }, [selectedStep, needsUpdate])

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
  const bottomIsCropped =
    boundingRect.bottom + CARD_HEIGHT >
    (window.innerHeight || document.documentElement.clientHeight)

  if (rightSideIsCropped && tooltipPosition === 'auto') {
    position = getPosition(boundingRect, 'left', CARD_WIDTH, offset)
    tooltipPositionValue = 'left'
  }

  const url = window.location.pathname.split('/').pop()

  const handleRefreshPosition = () => {
    const elem = document.querySelector(steps[selectedStep].selector)
    if (lastBoundingRect && lastBoundingRect === JSON.stringify(elem?.getBoundingClientRect())) {
      return
    }
    setElem(elem)
    setNeedsUpdate(new Date())
    if (elem) {
      setLastBoundingRect(JSON.stringify(elem.getBoundingClientRect()))
    }
  }

  // Periodically refresh position every 100 ms
  useInterval(() => {
    handleRefreshPosition()
  }, 200)

  useLayoutEffect(() => {
    setTimeout(() => {
      handleRefreshPosition()
    }, DEFAULT_REFRESH_DELAY)

    handleRefreshPosition()
  }, [selectedStep, url])

  if (elem === null) {
    return <></>
  }

  // Safeguard for when page is still waiting to render.
  if (position.x == 0 && position.y == 0) {
    return <></>
  }

  if (!visible) return <></>

  const DefaultFooterContent = () => {
    const handleOnCTAClick = () => {
      if (steps[selectedStep].handlePrimaryButtonClick) {
        steps[selectedStep].handlePrimaryButtonClick()
        if (showHighlightOnly) {
          setShowTooltipContainer(false)
        }
      }
      if (selectedStep === steps.length - 1) {
        return onComplete()
      }
    }

    const handleOnSecondaryCTAClick = () => {
      if (steps[selectedStep].handleSecondaryButtonClick) {
        steps[selectedStep].handleSecondaryButtonClick()
        if (showHighlightOnly) {
          setShowTooltipContainer(false)
        }
      }
    }

    return (
      <>
        {showStepCount && (
          <TooltipStepCountContainer>
            <TooltipStepCounter className={getClassName('tooltipStepCounter', appearance)}>
              {selectedStep + 1} of {steps.length}
            </TooltipStepCounter>
          </TooltipStepCountContainer>
        )}
        <TooltipCTAContainer className={getClassName('tooltipCTAContainer', appearance)}>
          {steps[selectedStep].secondaryButtonTitle && (
            <Button
              title={steps[selectedStep].secondaryButtonTitle}
              appearance={appearance}
              onClick={handleOnSecondaryCTAClick}
              secondary
            />
          )}
          {steps[selectedStep].primaryButtonTitle && (
            <Button
              title={steps[selectedStep].primaryButtonTitle}
              appearance={appearance}
              onClick={handleOnCTAClick}
            />
          )}
        </TooltipCTAContainer>
      </>
    )
  }

  const DefaultTooltipStepContent = () => {
    return (
      <>
        {dismissible && (
          <TooltipDismissContainer
            data-testid="tooltip-dismiss"
            onClick={() => {
              if (onDismiss) {
                onDismiss()
              }
            }}
            className={getClassName('tooltipClose', appearance)}
          >
            <Close />
          </TooltipDismissContainer>
        )}
        <TitleSubtitle
          appearance={appearance}
          title={steps[selectedStep].title}
          subtitle={steps[selectedStep].subtitle}
        />
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
      {showHighlight && steps[selectedStep].showHighlight !== false && (
        <HiglightContainer
          style={{
            top: position?.y - 24 ?? 0,
            left: (tooltipPositionValue == 'left' ? boundingRect.x : position?.x - 24) ?? 0,
            cursor: showHighlightOnly ? 'pointer' : 'default',
          }}
          onClick={() => {
            if (showHighlightOnly) {
              setShowTooltipContainer(!showTooltipContainer)
            }
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
      {showTooltipContainer && (
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
      )}
    </>
  )
}

export default Tooltips
