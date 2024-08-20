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
} from '@floating-ui/react'

import type { AlignValue, HintProps } from '@/components/Hint'

export interface FloatingHintProps extends HintProps {
  onOpenChange?: UseFloatingOptions['onOpenChange']
  open: boolean
}

export interface FloatingHintReturn extends Partial<UseFloatingReturn> {
  getFloatingProps: UseInteractionsReturn['getFloatingProps']
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

  const { refs, floatingStyles, context } = useFloating({
    middleware: [offset(offsetMiddleware), flip(), shift()],
    onOpenChange,
    open,
    placement,
    whileElementsMounted: autoUpdate,
  })

  // console.log(context)

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  // Merge all the interactions into prop getters
  const { getFloatingProps } = useInteractions([click, dismiss, role])

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      refs.setReference(anchorQuery)
    } else {
      console.debug(`[frigade] Hint: No anchor found for selector: ${anchor}`)
    }
  }, [anchor])

  return {
    getFloatingProps,
    floatingStyles,
    refs,
  }
}
