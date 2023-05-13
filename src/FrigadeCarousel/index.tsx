import React, { useEffect, useRef, useState } from 'react'
import { useFlows } from '../api/flows'

import { CarouselCard } from './CarouselCard'
import { ProgressBar } from './ProgressBar'

import {
  Body,
  CarouselContainer,
  StyledCarouselFade,
  CarouselScroll,
  CarouselScrollGroup,
  StyledScrollButton,
  H3,
} from './styled'

const RightArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6L20 12" stroke="#0B93FF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 18L20 12" stroke="#0B93FF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="#0B93FF" strokeWidth="2.5" strokeLinecap="round" />
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

export interface FrigadeCarouselProps {
  flowId: string
}

export const FrigadeCarousel: React.FC<FrigadeCarouselProps> = ({ flowId }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)
  const [flowMetadata, setFlowMetadata] = useState(null)
  const [flowSteps, setFlowSteps] = useState([])
  const [numberOfStepsCompleted, setNumberOfStepsCompleted] = useState(0)

  const { getFlowMetadata, getFlowSteps, getNumberOfStepsCompleted, isLoading } = useFlows()

  useEffect(() => {
    if (isLoading) return

    const metadata = getFlowMetadata(flowId)
    const completedStepCount = getNumberOfStepsCompleted(flowId)
    const steps = getFlowSteps(flowId)

    setFlowMetadata(metadata)
    if (metadata.data !== null) {
      setFlowSteps(steps.sort((a, b) => Number(a.complete) - Number(b.complete)))
      setShowRightFade(steps.length > 3 ? true : false)
      setNumberOfStepsCompleted(completedStepCount)
    }
  }, [isLoading])

  const scrollGroups: any[][] = []
  for (let i = 0; i < flowSteps.length; i += 3) {
    scrollGroups.push(flowSteps.slice(i, i + 3))
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

  if (isLoading) return null

  return (
    <CarouselContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <H3 style={{ marginBottom: 4 }}>{flowMetadata?.title}</H3>
          <Body.Quiet>{flowMetadata?.description}</Body.Quiet>
        </div>

        <ProgressBar
          numberOfStepsCompleted={numberOfStepsCompleted}
          numberOfSteps={flowSteps.length}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <CarouselFade show={showLeftFade} onClick={() => handleScrollByPage(false)} />
        <CarouselFade side="right" show={showRightFade} onClick={handleScrollByPage} />

        <CarouselScroll ref={scrollContainerRef} onScroll={throttledScroll}>
          {scrollGroups.map((group, i) => (
            <CarouselScrollGroup
              key={i}
              style={{
                flex: `0 0 calc(100% - ${flowSteps.length > 3 ? 36 : 0}px)`,
              }}
            >
              {group.map((stepData, j) => (
                <CarouselCard
                  key={j}
                  stepData={stepData}
                  style={{ flex: flowSteps.length > 3 ? `0 1 calc(33% - 16px * 2 / 3)` : 1 }}
                />
              ))}
            </CarouselScrollGroup>
          ))}
        </CarouselScroll>
      </div>
    </CarouselContainer>
  )
}
