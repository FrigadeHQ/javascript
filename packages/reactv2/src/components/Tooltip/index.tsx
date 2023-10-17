import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { Box } from '../Box'
import { Button } from '../Button'
import { Text } from '../Text'

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

interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild'> {}
interface TooltipProps extends MergedRadixPopoverProps {
  anchor?: string
  style?: React.CSSProperties
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
}

export function Tooltip({ anchor, style, ...props }: TooltipProps) {
  const initialRect =
    'DOMRect' in globalThis
      ? new DOMRect()
      : {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          top: 0,
          right: 0,
          left: 0,
          toJSON: () => {},
        }
  const [contentRect, setContentRect] = useState(initialRect)

  // TEMP: Mock data
  const { title, subtitle, primaryButtonTitle } = {
    title: 'Hello world',
    subtitle: 'Very cool to meet you.',
    primaryButtonTitle: "Let's do this!",
  }

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

  if (['before', 'after'].includes(contentProps['align'])) {
    const mapToOriginalAlignValues = {
      after: 'end',
      before: 'start',
    }

    const originalOffset = contentProps['alignOffset'] ?? 0
    const originalStyleProp = contentProps['style'] ?? {}

    // Flip align prop back to valid Radix option
    contentProps['align'] = mapToOriginalAlignValues[contentProps['align']]

    // Move alignOffset to margin
    contentProps['style'] = {
      ...originalStyleProp,
      marginLeft: originalOffset,
    }

    // Move to max alignOffset (width of content)
    contentProps['alignOffset'] =
      (contentRect.width + originalOffset) * (contentProps['align'] == 'end' ? -1 : 1)
  }

  const anchorRef = useRef(null)
  const [anchorElementRef, setAnchorElementRef] = useState(null)

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      anchorRef.current = anchorQuery
      setAnchorElementRef(anchorRef)
    }
  }, [anchor])

  const [contentNode, setContentNode] = useState(null)

  const contentNodeRef = useCallback((node) => {
    setContentNode(node)
  }, [])

  useLayoutEffect(() => {
    if (!contentNode) return

    setContentRect(contentNode.getBoundingClientRect())
  }, [contentNode])

  if (anchorElementRef == null) return null

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorElementRef} />
      <Popover.Portal>
        <Popover.Content asChild {...contentProps} ref={contentNodeRef}>
          <Box
            backgroundColor="white"
            borderRadius="md"
            padding={5}
            style={{
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              ...style,
            }}
          >
            <Text.Body1 fontWeight="bold" mb={1}>
              {title}
            </Text.Body1>
            <Text.Body2>{subtitle}</Text.Body2>

            <Box
              pt={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text.Body2 fontWeight="demibold">1/4</Text.Body2>
              <Button.Primary title={primaryButtonTitle ?? 'Ok'} />
            </Box>

            <Popover.Close
              aria-label="Close"
              style={{
                background: 'transparent',
                border: 0,
                position: 'absolute',
                top: 8,
                right: 0,
              }}
            >
              <XMarkIcon height="20" fill="black" />
            </Popover.Close>
            {/* <Popover.Arrow /> */}
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
