import { keyframes } from '@emotion/react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@/components/Icon/XMarkIcon'

import { Box } from '@/components/Box'
import { Button, ButtonProps } from '@/components/Button'
import { Card } from '@/components/Card'
import { Media, MediaProps } from '@/components/Media'
import { Text, TextProps } from '@/components/Text'

import { mapDialogProps } from './mapDialogProps'

import { theme } from '@/shared/theme'
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

export interface DialogContentProps
  extends Pick<
    RadixDialog.DialogContentProps,
    | 'onOpenAutoFocus'
    | 'onCloseAutoFocus'
    | 'onEscapeKeyDown'
    | 'onPointerDownOutside'
    | 'onInteractOutside'
  > {}

export interface DialogRootProps extends RadixDialog.DialogProps {}

export interface DialogProps extends BoxPropsWithoutChildren, DialogRootProps, DialogContentProps {
  /**
   * The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   */
  modal?: boolean
}

export function Dialog({ children, className, modal = true, ...props }: DialogProps) {
  const {
    rootProps,
    contentProps,
    otherProps: { zIndex, ...otherProps },
  } = mapDialogProps(props)

  return (
    <RadixDialog.Root defaultOpen={true} modal={modal} {...rootProps}>
      <RadixDialog.Portal>
        <Box
          animation={`${fadeIn} 300ms ease-out`}
          className={className}
          display="grid"
          inset="0"
          padding="6"
          part="dialog-wrapper"
          pointerEvents="none"
          position="fixed"
          zIndex={zIndex ?? 10}
        >
          <RadixDialog.Overlay asChild>
            <Box
              background="rgb(0 0 0 / 0.5)"
              inset="0"
              part="dialog-overlay"
              position="absolute"
            />
          </RadixDialog.Overlay>
          <RadixDialog.Content
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            {...contentProps}
          >
            <Card
              alignSelf="center"
              boxShadow="md"
              justifySelf="center"
              maxHeight="100%"
              maxWidth="430px"
              overflowY="auto"
              padding={8}
              part="dialog"
              pointerEvents="auto"
              position="relative"
              {...otherProps}
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
      <Button.Plain part="close" position="absolute" right="2px" top="2px" {...props}>
        <XMarkIcon height="20" fill="currentColor" />
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
      <Text.H4 part="title" {...props}>
        {children}
      </Text.H4>
    </RadixDialog.Title>
  )
}

Dialog.displayName = 'Dialog'
