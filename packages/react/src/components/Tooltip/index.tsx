import { keyframes } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@/components/Icon/XMarkIcon'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '@/hooks/useBoundingClientRect'
import { Box } from '@/components/Box'
import { Button, ButtonProps } from '@/components/Button'
import { Card } from '@/components/Card'
import { Dot } from './Dot'
import { Media, MediaProps } from '@/components/Media'
import { Text, TextProps } from '@/components/Text'
import { getDotPosition } from './getDotPosition'
import { mapTooltipPropsToPopoverProps } from './mapTooltipPropsToPopoverProps'
import { BoxPropsWithoutChildren } from '@/components/Flow/FlowProps'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

function isVisible(elem: Element) {
  if (!(elem instanceof HTMLElement)) {
    return false
  }
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
}

export interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<
      Popover.PopoverContentProps,
      'align' | 'asChild' | 'color' | 'content' | 'translate' | 'forceMount'
    > {}
export interface TooltipProps
  extends BoxPropsWithoutChildren,
    Omit<MergedRadixPopoverProps, 'children'> {
  /**
   * How to align the Tooltip relative to the anchor.
   * Uses the same notation as the `align` property in [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover).
   */
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
  /**
   * @ignore
   */
  anchor?: string
  /**
   * Whether to show a spotlight behind the anchor. This will darken the rest of the page and highlight the anchor.
   */
  spotlight?: boolean
  /**
   * The Z-index of the tooltip. Defaults to auto.
   */
  zIndex?: number | string
  style?: React.CSSProperties
}

export function Tooltip({
  anchor,
  children,
  className,
  defaultOpen = true,
  open,
  part,
  spotlight = false,
  style = {},
  ...props
}: TooltipProps) {
  const { node: contentNode, rect: contentRect, ref: contentRef } = useBoundingClientRect()
  const { node: anchorNode, rect: anchorRect, ref: anchorRef } = useBoundingClientRect()
  const { contentProps, otherProps, rootProps } = mapTooltipPropsToPopoverProps(props, contentRect)

  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [alignAttr, setAlignAttr] = useState(contentProps.align)
  const [sideAttr, setSideAttr] = useState(contentProps.side)
  const [spotlightLeft, setSpotlightLeft] = useState(0)
  const [spotlightTop, setSpotlightTop] = useState(0)

  function isOpen() {
    // External override via props
    if (open != null) {
      console.log('OVERRIDE: ', open)
      return open
    }

    console.log('INTERNAL: ', internalOpen)

    // Internal open state
    return internalOpen
  }

  // Radix will update data attrs to let us know if Popover.Content has collided
  if (contentNode !== null) {
    const currentAlignAttr = contentNode.getAttribute('data-align')
    const currentSideAttr = contentNode.getAttribute('data-side')

    if (alignAttr !== currentAlignAttr) {
      setAlignAttr(currentAlignAttr)
    }

    if (sideAttr !== currentSideAttr) {
      setSideAttr(currentSideAttr)
    }
  }

  // Radix requires a separate ref to pass anchor through into Popover.Anchor
  const anchorVirtualRef = useRef(null)

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      anchorRef(anchorQuery)
      anchorVirtualRef.current = anchorQuery
    } else {
      console.debug(`[frigade] Tooltip: No anchor found for query: ${anchor}`)
    }
  }, [anchor])

  useEffect(() => {
    function checkElementForAnchor(element: Element) {
      if (element.matches(anchor)) {
        if (isVisible(element)) {
          return element
        } else {
          return null
        }
      }

      const anchorSelector = element.querySelectorAll(anchor)

      if (anchorSelector.length > 0) {
        if (isVisible(anchorSelector[0])) {
          return anchorSelector[0]
        } else {
          return null
        }
      }

      return null
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') {
          continue
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element)

          if (maybeAnchor != null) {
            anchorRef(maybeAnchor)
            anchorVirtualRef.current = maybeAnchor

            console.debug('[frigade] Tooltip: MutationObserver added anchor: ', maybeAnchor)

            break
          }
        }

        for (const node of mutation.removedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            continue
          }

          const maybeAnchor = checkElementForAnchor(node as Element)

          if (maybeAnchor != null) {
            anchorRef(null)
            anchorVirtualRef.current = null

            console.debug('[frigade] Tooltip: MutationObserver removed anchor: ', maybeAnchor)

            break
          }
        }
      }
    })

    observer.observe(document.querySelector('body'), { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const { scrollX, scrollY } = window

    setSpotlightLeft(anchorRect.left + scrollX)
    setSpotlightTop(anchorRect.top + scrollY)
  }, [anchorRect.left, anchorRect.top])

  if (anchorNode == null) {
    return null
  }

  let anchorRadius = '0'
  if (typeof window !== 'undefined') {
    anchorRadius = window.getComputedStyle(anchorNode).borderRadius
  }

  const dotPosition = getDotPosition({ props, alignAttr, sideAttr })

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorVirtualRef} />
      <Popover.Portal>
        <>
          {spotlight && (
            <Box
              animation={`${fadeIn} 300ms ease-out`}
              boxShadow="0 0 0 20000px rgb(0 0 0 / 0.5)"
              part="tooltip-spotlight"
              pointerEvents="none"
              position="absolute"
              style={{
                borderRadius: anchorRadius,
                height: anchorRect.height,
                left: spotlightLeft,
                top: spotlightTop,
                width: anchorRect.width,
              }}
              {...(props.zIndex != null
                ? {
                    zIndex: props.zIndex,
                  }
                : {})}
            />
          )}
          <Popover.Content key={internalOpen} {...contentProps} ref={contentRef}>
            <>
              {isOpen() && (
                <Card
                  animation={`${fadeIn} 300ms ease-out`}
                  boxShadow="md"
                  position="relative"
                  className={className}
                  maxWidth="min(360px, calc(100vw - 25px))"
                  part={['tooltip', part]}
                  style={style}
                  {...otherProps}
                >
                  {children}
                </Card>
              )}
              <Dot
                onClick={() => {
                  setInternalOpen(() => {
                    if (typeof rootProps.onOpenChange === 'function') {
                      rootProps.onOpenChange(!isOpen())
                    }

                    return !isOpen()
                  })
                }}
                style={dotPosition}
              />
            </>
          </Popover.Content>
        </>
      </Popover.Portal>
    </Popover.Root>
  )
}

Tooltip.Close = (props: ButtonProps) => {
  return (
    <Popover.Close aria-label="Close" asChild>
      <Button.Plain
        css={{
          top: '0px',
          right: '-6px',
        }}
        part="close"
        position="absolute"
        {...props}
      >
        <XMarkIcon height="20" fill="currentColor" />
      </Button.Plain>
    </Popover.Close>
  )
}

Tooltip.Media = ({ src, ...props }: MediaProps) => {
  if (src == null) return null

  return (
    <Media
      aspectRatio="2"
      borderRadius="md md 0 0"
      borderWidth="0"
      margin="-5 -5 0"
      objectFit="cover"
      overflowClipMargin="unset"
      src={src}
      transform="translate3d(0, 0, 1px)"
      {...props}
    />
  )
}

Tooltip.Primary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Primary title={title} onClick={onClick} {...props} />
}

Tooltip.Progress = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 part="progress" {...props}>
      {children}
    </Text.Body2>
  )
}

Tooltip.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Tooltip.Subtitle = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 part="subtitle" {...props}>
      {children}
    </Text.Body2>
  )
}

Tooltip.Title = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.H4 part="title" {...props}>
      {children}
    </Text.H4>
  )
}
