import { TooltipProps } from '.'

const RADIX_PROPS = {
  content: [
    'align',
    'alignOffset',
    'arrowPadding',
    'avoidCollisions',
    'collisionBoundary',
    'collisionPadding',
    'forceMount',
    'hideWhenDetached',
    'onCloseAutoFocus',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onInteractOutside',
    'onOpenAutoFocus',
    'onPointerDownOutside',
    'side',
    'sideOffset',
    'sticky',
  ],
  root: ['defaultOpen', 'modal', 'onOpenChange', 'open'],
}

export function mapTooltipPropsToPopoverProps(props: TooltipProps, contentRect: DOMRect) {
  const contentProps = Object.fromEntries(
    RADIX_PROPS.content
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )
  const rootProps = Object.fromEntries(
    RADIX_PROPS.root
      .map((propName) => [propName, props[propName]])
      .filter((propEntry) => propEntry[1] !== undefined)
  )

  const otherProps = {}

  for (const propName of Object.keys(props)) {
    if (!RADIX_PROPS.content.includes(propName) && !RADIX_PROPS.root.includes(propName)) {
      otherProps[propName] = props[propName]
    }
  }

  // Default to align=after, side=bottom
  contentProps.align = contentProps.align ?? 'after'
  contentProps.side = contentProps.side ?? 'bottom'

  /*
    Here we're extending Popover.Content's align prop to accept 'before' and
    'after' in addition to its existing values.

    TL;DR:
      1. Use existing alignOffset prop to push Content to be before/after the
         corresponding edge of the element it's attached to.
      2. Add a CSS margin to patch alignOffset back onto Content, as Popover
         has a bug that prevents alignOffset from extending past the edge of
         its Trigger/Anchor.

         SEE: https://github.com/radix-ui/primitives/issues/2457
  */
  if (['before', 'after'].includes(contentProps.align)) {
    const mapToOriginalAlignValues = {
      after: 'end',
      before: 'start',
    }

    const mapAlignOffsetToMargin = (align, side) => {
      /*
        Translate alignOffset to CSS margin based on align and side props:
          bottom || top
            after: marginLeft
            before: marginRight
          left || right
            after: marginTop
            before: marginBottom
      */
      if (['top', 'bottom'].includes(side)) {
        if (align == 'after') {
          return 'marginLeft'
        } else {
          return 'marginRight'
        }
      } else {
        if (align == 'after') {
          return 'marginTop'
        } else {
          return 'marginBottom'
        }
      }
    }

    const originalOffset = contentProps.alignOffset ?? 0
    const originalStyleProp = contentProps.style ?? {}
    const currentSide = contentProps.side ?? 'bottom'
    const currentAlign = contentProps.align

    // Copy alignOffset value to CSS margin
    contentProps['style'] = {
      ...originalStyleProp,
      [mapAlignOffsetToMargin(currentAlign, currentSide)]: originalOffset,
    }

    const lengthOfCurrentSide = ['top', 'bottom'].includes(currentSide)
      ? contentRect.width
      : contentRect.height

    // Change alignOffset to be at the end of the positioned side
    contentProps.alignOffset = (lengthOfCurrentSide + originalOffset) * -1

    // Flip align prop back to valid Radix option, or default to 'after'
    contentProps['align'] = mapToOriginalAlignValues[currentAlign]
  }

  return {
    contentProps,
    otherProps,
    rootProps,
  }
}
