import { useEffect } from 'react'

import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
  useInteractions,
  type UseInteractionsReturn,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react'

import type { AlignValue, ExtendedPlacement, HintProps } from '@/components/Hint'

import { useMutationAwareAnchor } from '@/components/Hint/useMutationAwareAnchor'

export interface FloatingHintProps extends HintProps {
  onOpenChange?: UseFloatingOptions['onOpenChange']
  open: boolean
}

export interface FloatingHintReturn extends Partial<Omit<UseFloatingReturn, 'placement'>> {
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

export function useFloatingHint({
  align,
  alignOffset,
  anchor,
  onOpenChange = () => {},
  open,
  side,
  sideOffset,
}: FloatingHintProps): FloatingHintReturn {
  const placement = `${side}-${getOriginalAlign(align)}` as Placement

  function offsetMiddleware({ rects }) {
    const offsets = {
      alignmentAxis: alignOffset,
      mainAxis: sideOffset,
    }

    // if align is before or after
    if (['after', 'before'].includes(align)) {
      // if side is bottom or top
      if (['bottom', 'top'].includes(side)) {
        // hOffset
        offsets.alignmentAxis = alignOffset - rects.floating.width
      } else {
        // vOffset
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
  } = useFloating({
    middleware: [offset(offsetMiddleware, [align, alignOffset, side, sideOffset]), flip(), shift()],
    onOpenChange,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePress: false,
  })
  const role = useRole(context)
  const status = useTransitionStatus(context)

  // Merge all the interactions into prop getters
  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role])

  const { anchorElement } = useMutationAwareAnchor(anchor)

  useEffect(() => {
    if (anchorElement != null) {
      refs.setReference(anchorElement)
    } else {
      console.debug(`[frigade] Hint: No anchor found for selector: ${anchor}`)
    }
  }, [anchorElement])

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
  }
}
