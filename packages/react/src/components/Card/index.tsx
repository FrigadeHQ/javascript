import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import * as React from 'react'
import type { JSX } from '@emotion/react/jsx-runtime'

import type { BoxProps } from '@/components/Box'
import { Button, type ButtonProps } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { type FlowPropsWithoutChildren } from '@/components/Flow'
import { FlowCard } from './FlowCard'
import { Media, type MediaProps } from '@/components/Media'
import { Text, type TextProps } from '@/components/Text'

import type { DismissHandler } from '@/hooks/useFlowHandlers'
import { XMarkIcon } from '@/components/Icon/XMarkIcon'

export interface CardHeaderProps extends BoxProps {
  dismissible?: boolean
  handleDismiss?: DismissHandler
  subtitle?: string
  title?: string
}

export interface CardComponent
  extends ForwardRefExoticComponent<
    Omit<FlowPropsWithoutChildren, 'ref'> & RefAttributes<unknown>
  > {
  Dismiss: (props: ButtonProps) => JSX.Element
  Header: (props: CardHeaderProps) => JSX.Element
  Footer: (props: BoxProps) => JSX.Element
  Media: (props: MediaProps) => JSX.Element
  Primary: (props: ButtonProps) => JSX.Element
  Secondary: (props: ButtonProps) => JSX.Element
  Subtitle: (props: TextProps) => JSX.Element
  Title: (props: TextProps) => JSX.Element
}

export interface CardProps extends FlowPropsWithoutChildren {
  children: React.ReactNode
}

export const Card = React.forwardRef(({ children, flowId, part, ...props }: CardProps, ref) => {
  // If props.flowId is set, render FlowCard instead
  if (flowId != null) {
    return <FlowCard flowId={flowId} {...props} />
  }

  const Component = props.as ?? Flex.Column
  return (
    <Component
      backgroundColor="neutral.background"
      borderColor="neutral.border"
      borderStyle="solid"
      borderRadius="md"
      borderWidth="0"
      gap={5}
      p={5}
      part={['card', part]}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
}) as CardComponent

Card.Dismiss = (props: ButtonProps) => {
  return (
    <Button.Plain aria-label="Dismiss" part="dismiss" padding={0} {...props}>
      <XMarkIcon height="20" fill="currentColor" />
    </Button.Plain>
  )
}

Card.Footer = ({ children, part, ...props }: BoxProps) => {
  return (
    <Flex.Row
      alignItems="center"
      gap={3}
      justifyContent="flex-end"
      part={['card-footer', part]}
      {...props}
    >
      {children}
    </Flex.Row>
  )
}

Card.Header = ({ dismissible, handleDismiss, part, subtitle, title, ...props }) => {
  if (
    !dismissible &&
    (title == null || title?.length === 0) &&
    (subtitle == null || subtitle?.length === 0)
  ) {
    return null
  }

  return (
    <Flex.Row
      alignItems="flex-start"
      flexWrap="wrap"
      gap={1}
      part={['card-header', part]}
      {...props}
    >
      <Card.Title maxWidth="calc(100% - 32px)">{title}</Card.Title>
      {dismissible && <Card.Dismiss onClick={handleDismiss} marginLeft="auto" />}
      <Card.Subtitle color="neutral.400" flexBasis="100%">
        {subtitle}
      </Card.Subtitle>
    </Flex.Row>
  )
}

Card.Media = ({ src, ...props }: MediaProps) => {
  if (src == null || src?.length === 0) return null

  return <Media borderRadius="md" src={src} {...props} />
}

Card.Primary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null || title?.length === 0) return null

  return <Button.Primary title={title} onClick={onClick} {...props} />
}

Card.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null || title?.length === 0) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Card.Subtitle = ({ children, part, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 display="block" color="neutral.400" part={['subtitle', part]} {...props}>
      {children}
    </Text.Body2>
  )
}

Card.Title = ({ children, part, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.H4 display="block" part={['title', part]} {...props}>
      {children}
    </Text.H4>
  )
}
