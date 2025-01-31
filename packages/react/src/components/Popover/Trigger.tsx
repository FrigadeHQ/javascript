import { useContext } from 'react'
import { Box, type BoxProps } from '@/components/Box'
import { PopoverContext } from './Root'

export interface PopoverTriggerProps extends BoxProps {}

export function Trigger({ children, part, ...props }: BoxProps) {
  const {
    floating: { getReferenceProps, refs },
    setIsOpen,
  } = useContext(PopoverContext)

  return (
    <Box
      ref={refs?.setReference}
      onClick={() => setIsOpen((prev) => !prev)}
      part={['popover-trigger', part]}
      {...props}
      {...(getReferenceProps?.() ?? {})}
    >
      {children}
    </Box>
  )
}
