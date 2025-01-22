import * as React from 'react'
import { keyframes } from '@emotion/react'

import { Box, type BoxProps } from '@/components/Box'

import { RemoveScroll } from 'react-remove-scroll'
import { useEffect, useState } from 'react'

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

  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (!lockScroll) {
      const handleScroll = () => {
        if (!hasScrolled) {
          setHasScrolled(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [lockScroll, hasScrolled])

  if (!lockScroll && hasScrolled) {
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
