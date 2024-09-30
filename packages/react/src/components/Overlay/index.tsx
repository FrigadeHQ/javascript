import * as React from 'react'
import { keyframes } from '@emotion/react'

import { Box, type BoxProps } from '@/components/Box'

import { RemoveScroll } from 'react-remove-scroll'

export interface OverlayProps extends BoxProps {}

function OverlayWithRef(
  { children, part, opacity = 0.5, ...props }: OverlayProps,
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

  return (
    <RemoveScroll forwardProps ref={ref}>
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
