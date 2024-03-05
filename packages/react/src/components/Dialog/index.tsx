import * as RadixDialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { Box, type BoxProps } from '../Box'
import { Button, ButtonProps } from '../Button'
import { Card } from '../Card'
import { Media, MediaProps } from '../Media'
import { Text, TextProps } from '../Text'

import { theme } from '../../shared/theme'

export interface DialogProps extends BoxProps {}

// TODO: Add any RadixDialog props we want to support here
export function Dialog({ children, ...props }: DialogProps) {
  return (
    <RadixDialog.Root defaultOpen={true} modal={true}>
      <RadixDialog.Portal>
        <Box inset="0" position="fixed" zIndex="9999">
          <RadixDialog.Overlay asChild>
            <Box background="rgb(0 0 0 / 0.5)" part="dialog-overlay" position="fixed" inset="0" />
          </RadixDialog.Overlay>
          <RadixDialog.Content
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <Card
              boxShadow="md"
              left="50%"
              maxWidth="430px"
              p={8}
              part="dialog"
              position="fixed"
              top="50%"
              transform="translate(-50%, -50%)"
              {...props}
            >
              {children}
            </Card>
          </RadixDialog.Content>
        </Box>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

Dialog.Dismiss = (props: ButtonProps) => {
  return (
    <RadixDialog.Close aria-label="Close" asChild>
      <Button.Plain part="close" position="absolute" right="-4px" top="4px" {...props}>
        <XMarkIcon height="24" fill="currentColor" />
      </Button.Plain>
    </RadixDialog.Close>
  )
}

Dialog.Subtitle = ({ children, ...props }: TextProps) => {
  return (
    <RadixDialog.Description asChild>
      <Text.Body2 part="subtitle" {...props}>
        {children}
      </Text.Body2>
    </RadixDialog.Description>
  )
}

Dialog.Media = ({ src, ...props }: MediaProps) => {
  if (src == null) return null

  return <Media borderRadius="md" src={src} {...props} />
}

Dialog.Primary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Primary title={title} onClick={onClick} {...props} />
}

Dialog.ProgressDots = ({ current, total }: { current: number; total: number }) => {
  if (total == 1) {
    return null
  }

  const dots = [...Array(total)].map((_, i) => {
    return (
      <Box
        as="circle"
        key={i}
        r={4}
        cx={4 + 16 * i}
        cy="4px"
        fill={current === i ? theme.colors.blue500 : theme.colors.blue800}
        part={current === i ? 'progress-dot-selected' : 'progress-dot'}
      />
    )
  })

  return (
    <Box
      as="svg"
      height="8px"
      marginInline="auto"
      part="progress"
      viewBox={`0 0 ${16 * total - 8} 8`}
      width={16 * total - 8}
    >
      {dots}
    </Box>
  )
}

Dialog.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Dialog.Title = ({ children, ...props }: TextProps) => {
  return (
    <RadixDialog.Title asChild>
      <Text.H3 part="title" {...props}>
        {children}
      </Text.H3>
    </RadixDialog.Title>
  )
}

Dialog.displayName = 'Dialog'
