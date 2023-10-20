import { useEffect, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

import { useBoundingClientRect } from '../../hooks/useBoundingClientRect'
import { Box } from '../Box'
import { Button } from '../Button'
import { Dot } from './Dot'
import { Text } from '../Text'
import { mapTooltipPropsToRadixProps } from './mapTooltipPropsToPopoverProps'

interface MergedRadixPopoverProps
  extends Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>,
    Omit<Popover.PopoverContentProps, 'align' | 'asChild'> {}
export interface TooltipProps extends MergedRadixPopoverProps {
  anchor?: string
  style?: React.CSSProperties
  align?: Popover.PopoverContentProps['align'] | 'before' | 'after'
}

export function Tooltip({ anchor, style, ...props }: TooltipProps) {
  const { node: contentNode, rect: contentRect, ref: contentRef } = useBoundingClientRect()
  const [alignAttr, setAlignAttr] = useState(props.align)
  const [sideAttr, setSideAttr] = useState(props.side)

  // TEMP: Mock data
  const { title, subtitle, primaryButtonTitle } = {
    title: 'Hello world',
    subtitle: 'Very cool to meet you.',
    primaryButtonTitle: "Let's do this!",
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

  const { contentProps, rootProps } = mapTooltipPropsToRadixProps(props, contentRect)

  const anchorRef = useRef(null)
  const [anchorElementRef, setAnchorElementRef] = useState(null)

  useEffect(() => {
    const anchorQuery = document.querySelector(anchor)

    if (anchorQuery != null) {
      anchorRef.current = anchorQuery
      setAnchorElementRef(anchorRef)
    }
  }, [anchor])

  if (anchorElementRef == null) return null

  function getDotPosition() {
    const currentSide = sideAttr ?? 'bottom'
    const dotProps = {}

    // Radix's collision system isn't aware of our custom before|after align
    const currentAlign = (() => {
      if (['after', 'before'].includes(props.align)) {
        if (alignAttr == 'start') {
          return 'before'
        } else if (alignAttr == 'end') {
          return 'after'
        }
      }

      return props.align
    })()

    const dotOffset = '-24px'

    const oppositeSides = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }

    /* 
      Rules:
        - Dot is opposite to side prop (e.g. side=left -> dot=right)
        - align=before|end -> Dot goes to highest extent (right/bottom) of align-axis
        - align=after|start -> Dot goes to lowest extent (left/top) of align-axis
        - align=center -> Dot goes to the center
    */

    dotProps[oppositeSides[currentSide]] = dotOffset

    if (['before', 'end'].includes(currentAlign)) {
      if (['top', 'bottom'].includes(currentSide)) {
        dotProps['right'] = dotOffset
      } else {
        dotProps['bottom'] = dotOffset
      }
    } else if (['after', 'start'].includes(currentAlign)) {
      if (['top', 'bottom'].includes(currentSide)) {
        dotProps['left'] = dotOffset
      } else {
        dotProps['top'] = dotOffset
      }
    } else {
      // The only option left is align=center
      if (['top', 'bottom'].includes(currentSide)) {
        dotProps['left'] = `calc(50% + ${dotOffset})`
      } else {
        dotProps['top'] = `calc(50% + ${dotOffset})`
      }
    }

    return dotProps
  }

  const dotPosition = getDotPosition()

  return (
    <Popover.Root defaultOpen={true} {...rootProps}>
      <Popover.Anchor virtualRef={anchorElementRef} />
      <Popover.Portal>
        <Popover.Content asChild {...contentProps} ref={contentRef}>
          <Box
            backgroundColor="white"
            borderRadius="md"
            padding={5}
            style={{
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              width: '300px',
              ...style,
            }}
          >
            <Dot style={dotPosition} />

            {/* Image placeholder */}
            <Box
              backgroundColor="gray900"
              borderRadius="md"
              mb={5}
              mt={-5}
              mx={-5}
              style={{
                aspectRatio: '2',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />

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
          </Box>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
