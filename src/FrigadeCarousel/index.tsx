import React, { useEffect, useRef, useState } from 'react'
import { useFlows } from '../api/flows'

import { CarouselCard } from './CarouselCard'

import {
  Body,
  CarouselContainer,
  StyledCarouselFade,
  CarouselItems,
  CarouselScroll,
  CarouselScrollGroup,
  StyledScrollButton,
  H3,
  H4,
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
  const { getFlowMetadata, isLoading } = useFlows()

  useEffect(() => {
    if (isLoading) return

    const metadata = getFlowMetadata(flowId)
    setFlowMetadata(metadata)
    if (metadata.data !== null) {
      setFlowSteps(metadata.data)
      setShowRightFade(metadata.data.length > 3 ? true : false)
    }
  }, [isLoading])

  /* 
    TODO:
      - Scroll container size is slightly off (width of each item changes when total number of items changes)
      - Need to defeat batching of state updates when showing/hiding controls
        - Currently it'll show controls immediately when starting to scroll, but will wait until animation is done to hide controls
        - I suspect this is because it's waiting until it can grab an idle frame after scrolling is done
  */

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

  if (isLoading) return <div>Loading...</div>

  return (
    <CarouselContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <H3 style={{ marginBottom: 4 }}>{flowMetadata?.title}</H3>
          <Body.Quiet>{flowMetadata?.description}</Body.Quiet>
        </div>

        <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
          <Body.Loud style={{ marginRight: 8 }}>0 of 2</Body.Loud>
          <svg height={10} width={200}>
            <rect x={0} y={0} rx={5} width={200} height={10} fill="#E6E6E6" />
            <circle cx={5} cy={5} r={5} fill="#0B93FF" />
          </svg>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <CarouselFade show={showLeftFade} onClick={() => handleScrollByPage(false)} />
        <CarouselFade side="right" show={showRightFade} onClick={handleScrollByPage} />

        <CarouselScroll ref={scrollContainerRef} onScroll={throttledScroll}>
          <CarouselItems
            style={{
              width: flowSteps.length > 3 ? `calc(33% * ${flowSteps.length} - 40px)` : '100%',
            }}
          >
            {scrollGroups.map((group, i) => (
              <CarouselScrollGroup key={i}>
                {group.map((stepData, j) => (
                  <CarouselCard key={j} stepData={stepData} />
                ))}
              </CarouselScrollGroup>
            ))}
          </CarouselItems>
        </CarouselScroll>
      </div>
    </CarouselContainer>
  )
}
