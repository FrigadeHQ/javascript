import { useContext } from 'react'
import { FloatingNode } from '@floating-ui/react'
import { Box, type BoxProps } from '@/components/Box'
import { PopoverContext } from './Root'
import { useVisibility } from '@/hooks/useVisibility'

export interface PopoverContentProps extends BoxProps {}

export function Content({ children, css, part, style, ...props }: BoxProps) {
  const { floating, floatingNodeId } = useContext(PopoverContext)

  const { isVisible: isAnchorVisible } = useVisibility(
    floating?.refs.reference.current as Element | null
  )

  if (floating == null) {
    return null
  }

  const { floatingStyles, getFloatingProps, placement, refs, status } = floating

  if (refs.reference.current == null || !isAnchorVisible || status?.isMounted === false) {
    return null
  }

  return (
    <FloatingNode id={floatingNodeId}>
      <Box
        autoFocus
        css={{
          '&[data-status="unmounted"]': {
            display: 'none',
          },
          ...css,
        }}
        data-placement={placement}
        data-status={status.status}
        part={['popover-content', part]}
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          ...style,
        }}
        {...getFloatingProps()}
        {...props}
      >
        <Box part="popover-transition-container">{children}</Box>
      </Box>
    </FloatingNode>
  )
}
