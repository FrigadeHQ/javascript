import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import * as React from 'react'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'

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
  Dismiss: (props: ButtonProps) => EmotionJSX.Element
  Header: (props: CardHeaderProps) => EmotionJSX.Element
  Media: (props: MediaProps) => EmotionJSX.Element
  Primary: (props: ButtonProps) => EmotionJSX.Element
  Secondary: (props: ButtonProps) => EmotionJSX.Element
  Subtitle: (props: TextProps) => EmotionJSX.Element
  Title: (props: TextProps) => EmotionJSX.Element
}

export interface CardProps extends FlowPropsWithoutChildren {
  children: React.ReactNode
}

export const Card = React.forwardRef(({ children, flowId, ...props }: CardProps, ref) => {
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
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
}) as CardComponent

Card.Dismiss = (props: ButtonProps) => {
  return (
    <Button.Plain part="dismiss" padding={0} {...props}>
      <XMarkIcon height="20" fill="currentColor" />
    </Button.Plain>
  )
}

Card.Header = ({ dismissible, handleDismiss, subtitle, title, ...props }) => {
  return (
    <Flex.Row alignItems="flex-start" flexWrap="wrap" gap={1} part="card-header" {...props}>
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

Card.Subtitle = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 display="block" color="neutral.400" part="subtitle" {...props}>
      {children}
    </Text.Body2>
  )
}

Card.Title = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.H4 display="block" part="title" {...props}>
      {children}
    </Text.H4>
  )
}
