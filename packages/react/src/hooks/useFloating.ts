import { useEffect } from 'react'

import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useClick,
  useDismiss,
  useFloating as useFloatingUI,
  type UseFloatingOptions,
  type UseFloatingReturn,
  useFocus,
  useInteractions,
  type UseInteractionsReturn,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react'

import { useMutationAwareAnchor } from '@/components/Hint/useMutationAwareAnchor'

export type AlignValue = 'after' | 'before' | 'center' | 'end' | 'start'
export type SideValue = 'bottom' | 'left' | 'right' | 'top'
export type ExtendedPlacement = `${SideValue}-${AlignValue}`

export interface FloatingProps extends UseFloatingOptions {
  align?: AlignValue
  alignOffset?: number
  anchor?: string
  side?: SideValue
  sideOffset?: number
}

export interface FloatingReturn extends Omit<UseFloatingReturn, 'placement'> {
  placement: ExtendedPlacement
  getFloatingProps: UseInteractionsReturn['getFloatingProps']
  getReferenceProps: UseInteractionsReturn['getReferenceProps']
  status: ReturnType<typeof useTransitionStatus>
}

function getOriginalAlign(align: AlignValue) {
  switch (align) {
    case 'after':
      return 'end'
      break
    case 'before':
      return 'start'
      break
    default:
      return align
  }
}

export function useFloating({
  align,
  alignOffset,
  anchor,
  nodeId,
  onOpenChange = () => {},
  open,
  side,
  sideOffset,
}: FloatingProps): FloatingReturn {
  const placement = `${side}-${getOriginalAlign(align)}` as Placement

  // Handle our added "after" and "before" alignments
  function offsetMiddleware({ rects }) {
    const offsets = {
      alignmentAxis: alignOffset,
      mainAxis: sideOffset,
    }

    if (['after', 'before'].includes(align)) {
      if (['bottom', 'top'].includes(side)) {
        // Offset horizontally
        offsets.alignmentAxis = alignOffset - rects.floating.width
      } else {
        // Offset vertically
        offsets.alignmentAxis = alignOffset - rects.floating.height
      }
    }

    return offsets
  }

  const {
    context,
    floatingStyles,
    placement: computedPlacement,
    refs,
    ...floatingReturn
  } = useFloatingUI({
    middleware: [offset(offsetMiddleware, [align, alignOffset, side, sideOffset]), flip(), shift()],
    nodeId,
    onOpenChange,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  })

  const clickHandler = useClick(context)
  const dismissHandler = useDismiss(context, {
    outsidePress: false,
  })
  const focusProps = useFocus(context)
  const roleProps = useRole(context)
  const status = useTransitionStatus(context)

  const { getFloatingProps, getReferenceProps } = useInteractions([
    clickHandler,
    dismissHandler,
    focusProps,
    roleProps,
  ])

  /*
   * Note: If anchor is passed in as a selector, we'll automatically pass it
   * through to refs.setReference If not, we assume that the floating reference
   * element is being set manually elsewhere (e.g. Popover.Trigger)
   */
  const { anchorElement } = useMutationAwareAnchor(anchor)

  useEffect(() => {
    if (anchorElement != null) {
      refs.setReference(anchorElement)
    }
  }, [anchor, anchorElement, refs])

  // The flip() middleware might reverse the align prop
  const finalPlacement = computedPlacement.split('-')

  // Check and flip after/before alignment
  if (align === 'before') {
    finalPlacement[1] = finalPlacement[1] === 'end' ? 'after' : 'before'
  } else if (align === 'after') {
    finalPlacement[1] = finalPlacement[1] === 'start' ? 'before' : 'after'
  }

  return {
    context,
    getFloatingProps,
    getReferenceProps,
    floatingStyles,
    placement: finalPlacement.join('-') as ExtendedPlacement,
    refs,
    status,
    ...floatingReturn,
  }
}
