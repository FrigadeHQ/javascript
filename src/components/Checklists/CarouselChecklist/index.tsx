import React, { useEffect, useRef, useState } from 'react'
import { useFlows } from '../../../api/flows'
import { useMediaQuery } from '../../../hooks/useMediaQuery'

import { CarouselCard } from './CarouselCard'

import {
  Body,
  CarouselContainer,
  CarouselScroll,
  CarouselScrollGroup,
  CarouselTitle,
  ProgressWrapper,
  StyledCarouselFade,
  StyledScrollButton,
} from './styled'
import { DefaultFrigadeFlowProps } from '../../../types'
import { getClassName, mergeClasses } from '../../../shared/appearance'
import { RenderInlineStyles } from '../../RenderInlineStyles'
import { ProgressBar } from '../Checklist/ProgressBar'

const RightArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6L20 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 18L20 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const CarouselFade: React.FC<{ side?: string; show?: boolean; onClick?: any }> = ({
  side = 'left',
  show = false,
  onClick = () => {},
}) => {
  const [mounted, setMounted] = useState(false)
  const [reversed, setReversed] = useState(false)

  useEffect(() => {
    if (show === true && mounted === false) {
      setMounted(true)
    } else if (show === false && mounted === true) {
      setReversed(true)
    }
  }, [show])

  const handleFadeOutEnd = () => {
    setMounted(false)
    setReversed(false)
  }

  const style: React.CSSProperties =
    side == 'left'
      ? { top: 0, bottom: 0, left: -20, transform: 'rotate(180deg)' }
      : { top: 0, bottom: 0, right: -20 }

  return mounted ? (
    <StyledCarouselFade
      style={style}
      reversed={reversed}
      onAnimationEnd={reversed ? handleFadeOutEnd : null}
    >
      <StyledScrollButton onClick={() => onClick()} style={{ right: 16, top: 'calc(50% - 24px)' }}>
        <RightArrow />
      </StyledScrollButton>
    </StyledCarouselFade>
  ) : null
}

export interface CarouselChecklistProps extends DefaultFrigadeFlowProps {
  flowId: string
}

export const CarouselChecklist: React.FC<CarouselChecklistProps> = ({
  flowId,
  appearance,
  customVariables,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)
  const [flowMetadata, setFlowMetadata] = useState(null)
  const [flowSteps, setFlowSteps] = useState([])
  const [numberOfStepsCompleted, setNumberOfStepsCompleted] = useState(0)
  const { isSmall } = useMediaQuery()

  const pageSize = isSmall ? 1 : 3

  const {
    getFlowMetadata,
    getFlowSteps,
    getNumberOfStepsCompleted,
    updateCustomVariables,
    isLoading,
  } = useFlows()

  useEffect(() => {
    updateCustomVariables(customVariables)
  }, [customVariables, isLoading])

  useEffect(() => {
    if (isLoading) return

    const metadata = getFlowMetadata(flowId)
    const completedStepCount = getNumberOfStepsCompleted(flowId)
    const steps = getFlowSteps(flowId)

    setFlowMetadata(metadata)
    if (metadata.data !== null) {
      setFlowSteps(steps.sort((a, b) => Number(a.complete) - Number(b.complete)))
      setShowRightFade(steps.length > pageSize)
      setNumberOfStepsCompleted(completedStepCount)
    }
  }, [isLoading])

  const scrollGroups: any[][] = []
  for (let i = 0; i < flowSteps.length; i += pageSize) {
    scrollGroups.push(flowSteps.slice(i, i + pageSize))
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    const maxScroll = target.scrollWidth - target.clientWidth
    // Round up to avoid issues with fractional pixels
    const currentScroll = Math.ceil(target.scrollLeft)

    if (currentScroll > 0 && showLeftFade === false) {
      setShowLeftFade(true)
    }

    if (currentScroll === 0 && showLeftFade === true) {
      setShowLeftFade(false)
    }

    if (currentScroll < maxScroll && showRightFade === false) {
      setShowRightFade(true)
    }

    if (currentScroll === maxScroll && showRightFade === true) {
      setShowRightFade(false)
    }
  }

  const handleScrollByPage = (forward = true) => {
    const direction = forward ? 1 : -1

    if (scrollContainerRef.current === null) return

    scrollContainerRef.current.scrollBy({
      left: scrollContainerRef.current.clientWidth * direction,
      behavior: 'smooth',
    })
  }

  let scrollTimeout = null
  const throttledScroll = (e: React.UIEvent<HTMLElement>) => {
    if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout)
    } else {
      // Invoke once before starting to throttle
      handleScroll(e)
    }

    scrollTimeout = setTimeout(() => {
      handleScroll(e)
    }, 16)
  }

  if (isLoading) {
    return null
  }

  return (
    <CarouselContainer
      className={mergeClasses(getClassName('carouselContainer', appearance), className)}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: isSmall ? 'center' : 'space-between',
          marginBottom: 20,
          flexWrap: isSmall ? 'wrap' : 'nowrap',
          gap: isSmall ? 16 : 20,
        }}
      >
        <div>
          <CarouselTitle className={getClassName('carouselTitle', appearance)}>
            {flowMetadata?.title}
          </CarouselTitle>
          <Body.Quiet className={getClassName('carouselSubtitle', appearance)}>
            {flowMetadata?.subtitle}
          </Body.Quiet>
        </div>
        <ProgressWrapper className={getClassName('progressWrapper', appearance)}>
          <ProgressBar
            count={numberOfStepsCompleted}
            total={flowSteps.length}
            appearance={appearance}
          />
        </ProgressWrapper>
      </div>

      <div style={{ position: 'relative' }}>
        <CarouselFade show={showLeftFade} onClick={() => handleScrollByPage(false)} />
        <CarouselFade side="right" show={showRightFade} onClick={handleScrollByPage} />

        <CarouselScroll ref={scrollContainerRef} onScroll={throttledScroll}>
          {scrollGroups.map((group, i) => (
            <CarouselScrollGroup
              key={i}
              style={{
                flex: `0 0 calc(100% - ${flowSteps.length > pageSize ? 36 : 0}px)`,
              }}
            >
              {group.map((stepData, j) => (
                <CarouselCard
                  key={j}
                  stepData={stepData}
                  style={{
                    flex:
                      flowSteps.length > pageSize
                        ? `0 1 calc(100% / ${pageSize} - 16px * 2 / ${pageSize})`
                        : 1,
                  }}
                  appearance={appearance}
                />
              ))}
            </CarouselScrollGroup>
          ))}
        </CarouselScroll>
      </div>
      <RenderInlineStyles appearance={appearance} />
    </CarouselContainer>
  )
}
