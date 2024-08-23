import { useState } from 'react'

import { Box, type BoxProps } from '@/components/Box'
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
  part,
  side = 'bottom',
  sideOffset = 0,
  spotlight = false,
  style = {},
  ...props
}: HintProps) {
  const [contentOpen, setContentOpen] = useState(defaultOpen)

  const { getFloatingProps, floatingStyles, placement, refs } = useFloatingHint({
    align,
    alignOffset,
    anchor,
    // TODO: onOpenChange: setOpen,
    open: true,
    side,
    sideOffset,
  })

  const [finalSide, finalAlign] = placement.split('-')

  return (
    <>
      {spotlight && <Spotlight anchor={anchor} />}

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
        {contentOpen && children}

        <Ping
          onClick={() => {
            setContentOpen((prev) => !prev)
          }}
          position="absolute"
          style={getPingPosition({ align: finalAlign, side: finalSide })}
        />
      </Box>
    </>
  )
}
