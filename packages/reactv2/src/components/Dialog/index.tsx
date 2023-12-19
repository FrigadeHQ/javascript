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
        <RadixDialog.Overlay
          style={{ background: 'rgb(0 0 0 / 0.5)', position: 'fixed', inset: 0 }}
        />
        <RadixDialog.Content
          asChild
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <Card
            boxShadow="md"
            css={{
              left: '50%',
              maxWidth: 430,
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            p={8}
            position="fixed"
            textAlign="center"
            {...props}
          >
            {children}
          </Card>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

Dialog.Close = (props: ButtonProps) => {
  return (
    <RadixDialog.Close aria-label="Close" asChild>
      <Button.Plain
        css={{
          top: '4px',
          right: '-4px',
        }}
        part="close"
        position="absolute"
        {...props}
      >
        <XMarkIcon height="24" fill="currentColor" />
      </Button.Plain>
    </RadixDialog.Close>
  )
}

Dialog.Subtitle = ({ children, ...props }: TextProps) => {
  return (
    <RadixDialog.Description asChild>
      <Text.Body2 part="subtitle" mb={5} {...props}>
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
  const dots = [...Array(total)].map((_, i) => {
    return (
      <circle
        key={i}
        r={4}
        cx={4 + 16 * i}
        cy="4px"
        fill={current === i ? theme.colors.blue500 : theme.colors.blue800}
      />
    )
  })
  return (
    <Box
      as="svg"
      width={16 * total - 8}
      height="8px"
      viewBox={`0 0 ${16 * total - 8} 8`}
      margin="5 auto"
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
      <Text.H3 mb={1} part="title" {...props}>
        {children}
      </Text.H3>
    </RadixDialog.Title>
  )
}
