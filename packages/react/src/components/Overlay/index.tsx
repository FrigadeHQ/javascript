import * as React from 'react'
import { keyframes } from '@emotion/react'

import { Box, type BoxProps } from '@/components/Box'

import { RemoveScroll } from 'react-remove-scroll'
import { useState } from 'react'

export interface OverlayProps extends BoxProps {
  lockScroll?: boolean
}

function OverlayWithRef(
  { children, lockScroll = true, part, opacity = 0.5, ...props }: OverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: ${opacity}
    }
  `

  const [isScrolling, setIsScrolling] = useState(false)

  React.useEffect(() => {
    if (!lockScroll) {
      const handleScroll = () => {
        if (!isScrolling) {
          setIsScrolling(true)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [lockScroll, isScrolling])

  if (!lockScroll && isScrolling) {
    return <>{children}</>
  }

  return (
    <RemoveScroll forwardProps ref={ref} enabled={lockScroll}>
      <Box
        animation={`${fadeIn} 300ms ease-out`}
        backgroundColor="black"
        inset="0"
        opacity="0.5"
        part={['overlay', part]}
        position="fixed"
        {...props}
      >
        {children}
      </Box>
    </RemoveScroll>
  )
}

export const Overlay = React.forwardRef(OverlayWithRef)
