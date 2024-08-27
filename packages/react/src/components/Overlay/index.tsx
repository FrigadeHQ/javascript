import * as React from 'react'

import { Box, type BoxProps } from '@/components/Box'

import { RemoveScroll } from 'react-remove-scroll'

export interface OverlayProps extends BoxProps {}

// export function Overlay({ children, part, ...props }: OverlayProps) {
//   return (
//     <RemoveScroll forwardProps>
//       <Box
//         backgroundColor="black"
//         inset="0"
//         opacity="0.5"
//         part={['overlay', part]}
//         position="absolute"
//         {...props}
//       >
//         {children}
//       </Box>
//     </RemoveScroll>
//   )
// }

function OverlayWithRef(
  { children, part, ...props }: OverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <RemoveScroll forwardProps ref={ref}>
      <Box
        backgroundColor="black"
        inset="0"
        opacity="0.5"
        part={['overlay', part]}
        position="absolute"
        {...props}
      >
        {children}
      </Box>
    </RemoveScroll>
  )
}

export const Overlay = React.forwardRef(OverlayWithRef)
