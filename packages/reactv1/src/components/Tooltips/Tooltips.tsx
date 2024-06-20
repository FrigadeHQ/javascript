import React, { CSSProperties, FC, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from '../Button'
import { Close } from '../Icons/Close'
import styled from 'styled-components'
import { getPosition, useElemRect } from './position'
import {
  TooltipContainer,
  TooltipContentContainer,
  TooltipCTAContainer,
  TooltipDismissButton,
  TooltipFooter,
  TooltipImageContainer,
  TooltipStepCountContainer,
  TooltipStepCounter,
  TooltipVideoContainer,
} from './styled'
import { StepData } from '../../types'

import { getClassName } from '../../shared/appearance'
import { TitleSubtitle } from '../TitleSubtitle/TitleSubtitle'
import { VideoCard } from '../Video/VideoCard'
import { PoweredByFrigadeTooltipRibbon } from '../branding/styled'
import { PoweredByFrigade } from '../branding/PoweredByFrigade'
import { FrigadeTourProps } from '../../FrigadeTour'
import { useDebug } from '../../hooks/useDebug'

export type ToolTipPosition = 'left' | 'right' | 'auto'

const DEFAULT_CARD_WIDTH = 300
const DEFAULT_CARD_HEIGHT = 100
const DEFAULT_REFRESH_DELAY = 500
const HIGHLIGHT_RADIUS = 12

export interface ToolTipData extends StepData {
  selector?: string
  subtitleStyle?: CSSProperties
  titleStyle?: CSSProperties
  buttonStyle?: CSSProperties
}

interface ToolTipPropsInternal extends FrigadeTourProps {
  completedStepsCount: number
  onViewTooltip: (step: number) => void
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

const PositionWrapper = styled.div<{ primaryColor: string }>`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => (props.zIndex ? props.zIndex : 90)};
`

const HighlightContainer = styled(PositionWrapper)`
  width: ${HIGHLIGHT_RADIUS + 12}px;
  height: ${HIGHLIGHT_RADIUS + 12}px;
`
function isVisible(elem: Element) {
  if (!(elem instanceof HTMLElement)) {
    return false
  }
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
}

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
  showFrigadeBranding = false,
  cssPosition = 'absolute',
  onViewTooltip,
  className,
}) => {
  const { logErrorIfDebugMode } = useDebug()
  const [selfBounds, setSelfBounds] = useState<undefined | Partial<DOMRect>>()
  const [needsUpdate, setNeedsUpdate] = useState(new Date())
  const selfRef = useRef(null)

  const [elem, setElem] = useState(document.querySelector(steps[selectedStep].selector))
  const boundingRect = useElemRect(elem, needsUpdate)
  const [lastBoundingRect, setLastBoundingRect] = useState<string>()
  const [showTooltipContainer, setShowTooltipContainer] = useState(!showHighlightOnly)
  const positionStyle =
    cssPosition != 'static'
      ? steps[selectedStep]?.props?.position
        ? steps[selectedStep].props.position
        : cssPosition
      : 'static'
  const zIndex = steps[selectedStep]?.props?.zIndex ?? 90
  const cardWidth = selfBounds?.width ?? DEFAULT_CARD_WIDTH
  const cardHeight = selfBounds?.height ?? DEFAULT_CARD_HEIGHT
  const [renderTime, setRenderTime] = useState(new Date().getTime())
  offset = cssPosition != 'static' ? steps[selectedStep]?.props?.offset ?? offset : { x: 0, y: 0 }

  const url = window.location.pathname.split('/').pop()

  useLayoutEffect(() => {
    if (selfRef.current) {
      setSelfBounds({
        width: selfRef.current.clientWidth,
        height: selfRef.current.clientHeight,
      })
    }
  }, [selectedStep, needsUpdate, positionStyle])

  useEffect(() => {
    if (!showHighlightOnly) {
      setShowTooltipContainer(true)
    }
  }, [selectedStep])

  useEffect(() => {
    if (visible && showTooltipContainer) {
      onViewTooltip(selectedStep)
    }
  }, [showTooltipContainer])

  const handleRefreshPosition = () => {
    if (positionStyle === 'static') {
      return
    }

    const elem = document.querySelector(steps[selectedStep].selector)
    if (!elem || !isVisible(elem)) {
      setLastBoundingRect(undefined)
      setElem(null)
      logErrorIfDebugMode(
        `FrigadeTour: Could not find element with selector "${steps[selectedStep].selector}" for step ${steps[selectedStep].id}`
      )
      return
    }
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

  useEffect(() => {
    if (!visible) {
      return
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  if (elem === null || !visible) {
    return null
  }

  let tooltipPositionValue: ToolTipPosition =
    tooltipPosition === 'auto' ? 'right' : (tooltipPosition as ToolTipPosition)

  let position = getPosition(boundingRect, tooltipPositionValue, cardWidth, offset, positionStyle)

  const rightSideIsCropped =
    boundingRect.right + cardWidth > (window.innerWidth || document.documentElement.clientWidth)
  const bottomIsCropped =
    boundingRect.bottom + DEFAULT_CARD_HEIGHT >
    (window.innerHeight || document.documentElement.clientHeight)

  if (rightSideIsCropped && tooltipPosition === 'auto') {
    position = getPosition(boundingRect, 'left', cardWidth, offset, positionStyle)
    tooltipPositionValue = 'left'
  }

  if (
    steps[selectedStep]?.props?.tooltipPosition &&
    steps[selectedStep]?.props?.tooltipPosition !== 'auto' &&
    (steps[selectedStep]?.props?.tooltipPosition === 'left' ||
      steps[selectedStep]?.props?.tooltipPosition === 'right')
  ) {
    tooltipPositionValue = steps[selectedStep].props.tooltipPosition
  }

  const DefaultFooterContent = () => {
    const handleOnCTAClick = () => {
      if (steps[selectedStep].handlePrimaryButtonClick) {
        steps[selectedStep].handlePrimaryButtonClick()
        setShowTooltipContainer(false)
        setTimeout(() => {
          handleRefreshPosition()
        }, 30)
      }
      if (completedStepsCount === steps.length - 1) {
        return onComplete()
      }
    }

    const handleOnSecondaryCTAClick = () => {
      if (steps[selectedStep].handleSecondaryButtonClick) {
        steps[selectedStep].handleSecondaryButtonClick()
        if (showHighlightOnly && !steps[selectedStep].secondaryButtonUri) {
          setShowTooltipContainer(false)
        }
      }
    }

    return (
      <>
        {showStepCount && steps.length > 1 && (
          <TooltipStepCountContainer>
            <TooltipStepCounter
              role="status"
              className={getClassName('tooltipStepCounter', appearance)}
            >
              {selectedStep + 1} of {steps.length}
            </TooltipStepCounter>
          </TooltipStepCountContainer>
        )}
        {(steps[selectedStep].primaryButtonTitle || steps[selectedStep].secondaryButtonTitle) && (
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
        )}
      </>
    )
  }

  const DefaultTooltipStepContent = () => {
    return (
      <>
        {dismissible && (
          <TooltipDismissButton
            data-testid="tooltip-dismiss"
            onClick={() => {
              if (onDismiss) {
                onDismiss()
              }
            }}
            className={getClassName('tooltipClose', appearance)}
            hasImage={!!steps[selectedStep].imageUri || !!steps[selectedStep].videoUri}
            aria-label="Close Tooltip"
            role="button"
            tabIndex={0}
          >
            <Close />
          </TooltipDismissButton>
        )}
        {steps[selectedStep].imageUri && (
          <TooltipImageContainer
            dismissible={dismissible}
            appearance={appearance}
            role="img"
            aria-label={steps[selectedStep].title}
            src={steps[selectedStep].imageUri}
            className={getClassName('tooltipImageContainer', appearance)}
          />
        )}
        {steps[selectedStep].videoUri && !steps[selectedStep].imageUri && (
          <TooltipVideoContainer
            dismissible={dismissible}
            appearance={appearance}
            role="video"
            aria-label={steps[selectedStep].title}
            className={getClassName('tooltipVideoContainer', appearance)}
          >
            <VideoCard
              appearance={appearance}
              videoUri={steps[selectedStep].videoUri}
              autoplay={steps[selectedStep].props?.autoplayVideo}
              loop={steps[selectedStep].props?.loopVideo}
              hideControls={steps[selectedStep].props?.hideVideoControls}
            />
          </TooltipVideoContainer>
        )}
        <TooltipContentContainer className={getClassName('tooltipContentContainer', appearance)}>
          <TitleSubtitle
            appearance={appearance}
            title={steps[selectedStep].title}
            subtitle={steps[selectedStep].subtitle}
            size="small"
            ariaPrefix={`Tooltip${steps[selectedStep].id}`}
          />
          <TooltipFooter className={getClassName('tooltipFooter', appearance)}>
            <DefaultFooterContent />
          </TooltipFooter>
        </TooltipContentContainer>
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

  if (steps[selectedStep].complete === true) {
    return null
  }

  // Do not position the tooltip until 10ms after the first render
  // This is to prevent the tooltip from appearing in the wrong place
  // when the page is loading
  if (position.x == 0 && position.y == 0 && new Date().getTime() - renderTime < 100) {
    return null
  }

  const cssPos = {
    top: position?.y - HIGHLIGHT_RADIUS ?? 0,
    left:
      (tooltipPositionValue == 'left'
        ? boundingRect.x + offset.x
        : position?.x - HIGHLIGHT_RADIUS) ?? 0,
    cursor: showHighlightOnly ? 'pointer' : 'default',
    position: positionStyle,
  }

  // Lock tooltip position to be within bounds of the window
  const getBoundedLeftPosition = () => {
    const spaceFromEdge = 20
    const leftOffset = cssPos.left + (tooltipPositionValue == 'left' ? -cardWidth : 24)

    return Math.min(
      Math.max(leftOffset, spaceFromEdge),
      window.innerWidth - cardWidth - spaceFromEdge
    )
  }

  const getBoundedTopPosition = () => {
    const tooltipBottom = cssPos.top + cardHeight
    const spaceFromEdge = 20
    if (tooltipBottom > window.innerHeight - spaceFromEdge) {
      return cssPos.top + -cardHeight
    }
    return cssPos.top
  }

  const handleClick = () => {
    if (showHighlightOnly) {
      setNeedsUpdate(new Date())
      setShowTooltipContainer(!showTooltipContainer)
    }
  }

  return (
    <TooltipWrapper className={className}>
      <HighlightContainer
        style={cssPos}
        zIndex={zIndex}
        className={getClassName('tourHighlightContainer', appearance)}
      >
        {showHighlight &&
          steps[selectedStep].showHighlight !== false &&
          cssPosition !== 'static' && (
            <>
              <HighlightInner
                style={{
                  position: positionStyle,
                }}
                onClick={handleClick}
                primaryColor={appearance.theme.colorPrimary}
                className={getClassName('tourHighlightInnerCircle', appearance)}
              ></HighlightInner>
              <HighlightOuter
                style={{
                  position: 'absolute',
                }}
                onClick={handleClick}
                primaryColor={appearance.theme.colorPrimary}
                className={getClassName('tourHighlightOuterCircle', appearance)}
              ></HighlightOuter>
            </>
          )}
      </HighlightContainer>
      <PositionWrapper
        style={{
          ...cssPos,
          left: getBoundedLeftPosition(),
          top: getBoundedTopPosition(),
        }}
        zIndex={zIndex + 1}
        className={getClassName('tooltipContainerWrapper', appearance)}
      >
        {showTooltipContainer && (
          <>
            <TooltipContainer
              ref={selfRef}
              role="dialog"
              aria-labelledby={`frigadeTooltip${steps[selectedStep].id}Title`}
              aria-describedby={`frigadeTooltip${steps[selectedStep].id}Subtitle`}
              layoutId="tooltip-container"
              tabIndex={0}
              aria-label="Tooltip"
              style={{
                position: 'relative',
                width: 'max-content',
                right: 0,
                top: cssPosition !== 'static' ? 12 : 0,
                ...containerStyle,
              }}
              appearance={appearance}
              className={getClassName('tooltipContainer', appearance)}
              maxWidth={DEFAULT_CARD_WIDTH}
              zIndex={zIndex + 10}
            >
              <StepContent />
            </TooltipContainer>
            {showFrigadeBranding && (
              <PoweredByFrigadeTooltipRibbon
                className={getClassName('poweredByFrigadeTooltipRibbon', appearance)}
                appearance={appearance}
                zIndex={zIndex + 10}
              >
                <PoweredByFrigade appearance={appearance} />
              </PoweredByFrigadeTooltipRibbon>
            )}
          </>
        )}
      </PositionWrapper>
    </TooltipWrapper>
  )
}

export default Tooltips
