import { useState } from 'react'

import { Box, type BoxProps } from '@/components/Box'
import { Overlay } from '@/components/Overlay'
import { Ping } from '@/components/Ping'
import { Spotlight } from '@/components/Spotlight'

import { getPingPosition } from '@/components/Hint/getPingPosition'
import { useFloatingHint } from '@/components/Hint/useFloatingHint'

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'
export type SideValue = 'bottom' | 'left' | 'right' | 'top'
export type ExtendedPlacement = `${SideValue}-${AlignValue}`

export interface HintProps extends BoxProps {
  align?: AlignValue
  alignOffset?: number
  anchor: string
  children?: React.ReactNode
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: SideValue
  sideOffset?: number
  spotlight?: boolean
}

export function Hint({
  align = 'center',
  alignOffset = 0,
  anchor,
  children,
  defaultOpen = true,
  modal = false,
  onOpenChange = () => {},
  open,
  part,
  side = 'bottom',
  sideOffset = 0,
  spotlight = false,
  style = {},
  ...props
}: HintProps) {
  const [internalOpen, setInteralOpen] = useState(defaultOpen)

  // Defer to controlled open prop, otherwise manage open state internally
  const canonicalOpen = open ?? internalOpen

  const { getFloatingProps, getReferenceProps, floatingStyles, placement, refs } = useFloatingHint({
    align,
    alignOffset,
    anchor,
    onOpenChange: (newOpen) => {
      onOpenChange(newOpen)

      if (open == null) {
        setInteralOpen(newOpen)
      }
    },
    open: canonicalOpen,
    side,
    sideOffset,
  })

  const [finalSide, finalAlign] = placement.split('-')
  const referenceProps = getReferenceProps()

  return (
    <>
      {spotlight && canonicalOpen && <Spotlight anchor={anchor} />}
      {modal && !spotlight && canonicalOpen && <Overlay lockScroll />}

      <Box
        part={['hint', part]}
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          ...style,
        }}
        {...getFloatingProps()}
        {...props}
      >
        {canonicalOpen && children}

        <Ping
          {...referenceProps}
          position="absolute"
          style={getPingPosition({ align: finalAlign, side: finalSide })}
        />
      </Box>
    </>
  )
}
