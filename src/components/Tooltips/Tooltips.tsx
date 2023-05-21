import React, { CSSProperties, FC, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '../Button'
import { Close } from '../Icons/Close'
import styled from 'styled-components'
import { getPosition, useElemRect } from './position'
import {
  TooltipContainer,
  TooltipCTAContainer,
  TooltipDismissContainer,
  TooltipFooter,
  TooltipImageContainer,
  TooltipStepCountContainer,
  TooltipStepCounter,
  TooltipVideoContainer,
} from './styled'
import { Appearance, DefaultFrigadeFlowProps, StepData } from '../../types'

import { getClassName } from '../../shared/appearance'
import { TitleSubtitle } from '../TitleSubtitle/TitleSubtitle'
import { VideoCard } from '../Video/VideoCard'

export type ToolTipPosition = 'left' | 'right' | 'auto'

const DEFAULT_CARD_WIDTH = 300
const CARD_HEIGHT = 50
const DEFAULT_REFRESH_DELAY = 500
const HIGHLIGHT_RADIUS = 12

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
  dismissBehavior?: 'complete-flow' | 'complete-step'
}

interface ToolTipPropsInternal extends ToolTipProps {
  completedStepsCount: number
}

const HighlightOuter = styled.div<{ primaryColor: string }>`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
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
  width: ${HIGHLIGHT_RADIUS}px;
  height: ${HIGHLIGHT_RADIUS}px;
  border-radius: 100px;
  background-color: ${(props) => props.primaryColor};
  z-index: 20;
  opacity: 1;
`

const TooltipWrapper = styled.div`
  pointer-events: all;
`

const HiglightContainer = styled.div<{ primaryColor: string }>`
  width: ${HIGHLIGHT_RADIUS + 12}px;
  height: ${HIGHLIGHT_RADIUS + 12}px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => (props.zIndex ? props.zIndex : 90)};
`

const Tooltips: FC<ToolTipPropsInternal> = ({
  steps = [],
  onDismiss,
  onComplete = () => {},
  tooltipPosition = 'auto',
  showHighlight = true,
  primaryColor = '#000000',
  offset = { x: 0, y: 0 },
  visible = true,
  containerStyle = {},
  selectedStep = 0,
  customStepTypes,
  appearance,
  dismissible = false,
  showHighlightOnly,
  showStepCount = true,
  completedStepsCount = 0,
}) => {
  const [selfBounds, setSelfBounds] = useState<undefined | Partial<DOMRect>>(undefined)
  const [needsUpdate, setNeedsUpdate] = useState(new Date())
  const selfRef = useRef(null)

  const [elem, setElem] = useState(document.querySelector(steps[selectedStep].selector))
  const boundingRect = useElemRect(elem, needsUpdate)
  const [lastBoundingRect, setLastBoundingRect] = useState<string>()
  const [showTooltipContainer, setShowTooltipContainer] = useState(!showHighlightOnly)
  const positionStyle = steps[selectedStep]?.props?.position
    ? steps[selectedStep].props.position
    : 'absolute'
  const zIndex = steps[selectedStep]?.props?.zIndex ?? 90
  const cardWidth = selfBounds?.width ?? DEFAULT_CARD_WIDTH

  useLayoutEffect(() => {
    if (positionStyle === 'fixed') {
      return
    }

    if (selfRef.current) {
      setSelfBounds({
        width: selfRef.current.clientWidth,
        height: selfRef.current.clientHeight,
      })
    }
  }, [selectedStep, needsUpdate, positionStyle])

  let tooltipPositionValue: ToolTipPosition =
    tooltipPosition === 'auto' ? 'right' : (tooltipPosition as ToolTipPosition)
  let position = getPosition(
    boundingRect,
    tooltipPositionValue,
    selfBounds?.width,
    offset,
    positionStyle
  )

  const rightSideIsCropped =
    boundingRect.right + cardWidth > (window.innerWidth || document.documentElement.clientWidth)
  const bottomIsCropped =
    boundingRect.bottom + CARD_HEIGHT >
    (window.innerHeight || document.documentElement.clientHeight)

  if (rightSideIsCropped && tooltipPosition === 'auto') {
    position = getPosition(boundingRect, 'left', cardWidth, offset, positionStyle)
    tooltipPositionValue = 'left'
  }

  const url = window.location.pathname.split('/').pop()

  const handleRefreshPosition = () => {
    if (positionStyle === 'fixed') {
      return
    }

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

  useEffect(() => {
    const observer = new MutationObserver(handleRefreshPosition)
    observer.observe(document.body, { subtree: true, childList: true })
    return () => observer.disconnect()
  }, [handleRefreshPosition])

  useEffect(() => {
    const observer = new MutationObserver(handleRefreshPosition)
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => observer.disconnect()
  }, [handleRefreshPosition])

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefreshPosition()
    }, 10)
    return () => clearInterval(intervalId)
  }, [handleRefreshPosition])

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
      if (completedStepsCount === steps.length - 1) {
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
        <TooltipCTAContainer
          showStepCount={showStepCount}
          className={getClassName('tooltipCTAContainer', appearance)}
        >
          {steps[selectedStep].secondaryButtonTitle && (
            <Button
              title={steps[selectedStep].secondaryButtonTitle}
              appearance={appearance}
              onClick={handleOnSecondaryCTAClick}
              size="small"
              withMargin={false}
              secondary
            />
          )}
          {steps[selectedStep].primaryButtonTitle && (
            <Button
              title={steps[selectedStep].primaryButtonTitle}
              appearance={appearance}
              onClick={handleOnCTAClick}
              withMargin={false}
              size="small"
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
        {steps[selectedStep].imageUri && (
          <TooltipImageContainer
            dismissible={dismissible}
            appearance={appearance}
            src={steps[selectedStep].imageUri}
            className={getClassName('tooltipImageContainer', appearance)}
          />
        )}
        {steps[selectedStep].videoUri && !steps[selectedStep].imageUri && (
          <TooltipVideoContainer
            dismissible={dismissible}
            appearance={appearance}
            className={getClassName('tooltipVideoContainer', appearance)}
          >
            <VideoCard appearance={appearance} videoUri={steps[selectedStep].videoUri} />
          </TooltipVideoContainer>
        )}
        <TitleSubtitle
          appearance={appearance}
          title={steps[selectedStep].title}
          subtitle={steps[selectedStep].subtitle}
          size="small"
        />
        <TooltipFooter className={getClassName('tooltipFooter', appearance)}>
          <DefaultFooterContent />
        </TooltipFooter>
      </>
    )
  }

  const DEFAULT_CUSTOM_STEP_TYPES = {
    default: (_: StepData) => {
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

  if (showHighlightOnly && steps[selectedStep].complete === true) {
    return null
  }

  return (
    <TooltipWrapper>
      {showHighlight && steps[selectedStep].showHighlight !== false && (
        <HiglightContainer
          style={{
            top: position?.y - HIGHLIGHT_RADIUS ?? 0,
            left:
              (tooltipPositionValue == 'left' ? boundingRect.x : position?.x - HIGHLIGHT_RADIUS) ??
              0,
            cursor: showHighlightOnly ? 'pointer' : 'default',
            position: positionStyle,
          }}
          onClick={() => {
            if (showHighlightOnly) {
              setNeedsUpdate(new Date())
              setShowTooltipContainer(!showTooltipContainer)
            }
          }}
          zIndex={zIndex}
        >
          <HighlightInner
            style={{
              position: positionStyle,
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
            position: positionStyle,
            width: 'max-content',
            left:
              `${
                tooltipPositionValue == 'right' ? position?.x + HIGHLIGHT_RADIUS : position?.x
              }px` ?? 0,
            top: `${position?.y}px` ?? 0,
            ...containerStyle,
          }}
          appearance={appearance}
          className={getClassName('tooltipContainer', appearance)}
          maxWidth={DEFAULT_CARD_WIDTH}
          zIndex={zIndex + 10}
        >
          <StepContent />
        </TooltipContainer>
      )}
    </TooltipWrapper>
  )
}

export default Tooltips
