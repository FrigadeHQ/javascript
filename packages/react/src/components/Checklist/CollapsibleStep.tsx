import { keyframes } from '@emotion/react'
import { ChevronDownIcon } from '@/components/Icon/ChevronDownIcon'
import * as Collapsible from '@radix-ui/react-collapsible'

import { Box, type BoxProps } from '@/components/Box'
import { Card } from '@/components/Card'
import { Flex } from '@/components/Flex'
import { Text } from '@/components/Text'

const slideDown = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    height: var(--radix-collapsible-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
`
// TODO: CheckIcon and CheckIndicator are copypasta from RadioField.tsx. Clean this up.
const CheckIcon = () => (
  <Box as="svg" color="primary.foreground" width="10px" height="8px" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4.34664L3.4618 6.99729L3.4459 6.98017L9 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
)

function CheckIndicator({ checked = false }) {
  return (
    <Box
      backgroundColor="inherit"
      borderWidth="md"
      borderStyle="solid"
      borderColor="neutral.border"
      borderRadius="100%"
      marginRight="2"
      padding="0"
      part="field-radio-value"
      position="relative"
      height="22px"
      width="22px"
    >
      {checked && (
        <Box
          alignItems="center"
          bg="green500"
          borderWidth="md"
          borderStyle="solid"
          borderColor="green500"
          borderRadius="100%"
          display="flex"
          height="calc(100% + 2px)"
          justifyContent="center"
          left="-1px"
          part="field-radio-indicator"
          position="absolute"
          top="-1px"
          width="calc(100% + 2px)"
        >
          <CheckIcon />
        </Box>
      )}
    </Box>
  )
}

export function Content({ children }) {
  return (
    <Collapsible.Content asChild>
      <Flex.Column
        css={{
          '&[data-state="open"]': {
            animation: `${slideDown} 300ms ease-out`,
          },
          '&[data-state="closed"]': {
            animation: `${slideUp} 300ms ease-out`,
          },
          overflow: 'hidden',
        }}
        gap={5}
        part="collapsible-content"
      >
        {/*
          This humble box is doing yeoman's work, don't remove it.
          It creates a flex gap at the top of this column, which animates smoothly.
          Other forms of whitespace like margin or padding? Not so smooth!
        */}
        <Box part="checklist-spacer" />

        {children}
      </Flex.Column>
    </Collapsible.Content>
  )
}

export function Root({
  children,
  disabled = false,
  onOpenChange = () => {},
  open = false,
  ...props
}: Collapsible.CollapsibleProps & BoxProps) {
  return (
    <Collapsible.Root asChild disabled={disabled} open={open} onOpenChange={onOpenChange}>
      <Card
        borderWidth="md"
        css={{
          '&[data-state="open"] .fr-collapsible-step-icon': {
            transform: 'rotate(180deg)',
          },
        }}
        gap={0}
        part="collapsible-step"
        {...props}
      >
        {children}
      </Card>
    </Collapsible.Root>
  )
}

export function Trigger({ isCompleted, isBlocked, title }) {
  return (
    <Collapsible.Trigger asChild>
      <Flex.Row
        alignItems="center"
        justifyContent="flex-start"
        margin={-5}
        padding={5}
        zIndex={1}
        opacity={isBlocked ? 0.4 : 1}
        disabled={isBlocked}
        pointerEvents={isBlocked ? 'none' : 'auto'}
        cursor={isBlocked ? 'not-allowed' : 'pointer'}
        part="collapsible-header"
      >
        <CheckIndicator checked={isCompleted} />
        <Text.Body2 fontWeight="demibold" userSelect="none" part="collapsible-title">
          {title}
        </Text.Body2>

        <Box
          as={ChevronDownIcon}
          color="neutral.100"
          css={{
            '& path': {
              vectorEffect: 'non-scaling-stroke',
            },
          }}
          display="block"
          height="16px"
          marginLeft="auto"
          order={2}
          part="collapsible-step-icon"
          width="16px"
        />
      </Flex.Row>
    </Collapsible.Trigger>
  )
}
