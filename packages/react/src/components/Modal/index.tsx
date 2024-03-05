import * as RadixDialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { Box, type BoxProps } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Card } from '../Card'
import { Text, TextProps } from '../Text'

export interface ModalProps extends BoxProps {
  align?:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
}

const defaultPaddingToScreen = '24px'

export function Modal({ children, align, ...props }: ModalProps) {
  function getPositionArgs() {
    switch (align) {
      case 'top':
        return { top: defaultPaddingToScreen, left: '50%', transform: 'translate(-50%, 0)' }
      case 'bottom':
        return { bottom: defaultPaddingToScreen, left: '50%', transform: 'translate(-50%, 0)' }
      case 'left':
        return { top: '50%', left: defaultPaddingToScreen, transform: 'translate(0, -50%)' }
      case 'right':
        return { top: '50%', right: defaultPaddingToScreen, transform: 'translate(0, -50%)' }
      case 'top-left':
        return { top: defaultPaddingToScreen, left: defaultPaddingToScreen }
      case 'top-right':
        return { top: defaultPaddingToScreen, right: defaultPaddingToScreen }
      case 'bottom-left':
        return { bottom: defaultPaddingToScreen, left: defaultPaddingToScreen }
      case 'bottom-right':
        return { bottom: defaultPaddingToScreen, right: defaultPaddingToScreen }
    }

    return {
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <Box inset="0" position="fixed" zIndex="9999" width="100vw" height="100vh" pointerEvents="none">
      <Card
        boxShadow="md"
        p={8}
        part="modal"
        {...getPositionArgs()}
        {...props}
        position="fixed"
        pointerEvents="all"
      >
        {children}
      </Card>
    </Box>
  )
}

Modal.Dismiss = (props: ButtonProps) => {
  return (
    <RadixDialog.Close aria-label="Close" asChild>
      <Button.Plain part="close" position="absolute" right="-4px" top="4px" {...props}>
        <XMarkIcon height="24" fill="currentColor" />
      </Button.Plain>
    </RadixDialog.Close>
  )
}

Modal.Subtitle = ({ children, ...props }: TextProps) => {
  return (
    <RadixDialog.Description asChild>
      <Text.Body2 part="subtitle" {...props}>
        {children}
      </Text.Body2>
    </RadixDialog.Description>
  )
}

Modal.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Modal.Title = ({ children, ...props }: TextProps) => {
  return (
    <RadixDialog.Title asChild>
      <Text.H3 part="title" {...props}>
        {children}
      </Text.H3>
    </RadixDialog.Title>
  )
}

Modal.displayName = 'Modal'
