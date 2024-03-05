import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import * as React from 'react'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { Button, type ButtonProps } from '../Button'
import { Flex } from '../Flex'
import { type FlowPropsWithoutChildren } from '@/components/Flow'
import { FlowCard } from './FlowCard'
import { Media, type MediaProps } from '../Media'
import { Text, type TextProps } from '../Text'

export interface CardComponent
  extends ForwardRefExoticComponent<
    Omit<FlowPropsWithoutChildren, 'ref'> & RefAttributes<unknown>
  > {
  Dismiss: (props: ButtonProps) => EmotionJSX.Element
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
      <XMarkIcon height="24" fill="currentColor" />
    </Button.Plain>
  )
}

Card.Media = ({ src, ...props }: MediaProps) => {
  if (src == null) return null

  return <Media borderRadius="md" src={src} {...props} />
}

Card.Primary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Primary title={title} onClick={onClick} {...props} />
}

Card.Secondary = ({ onClick, title, ...props }: ButtonProps) => {
  if (title == null) return null

  return <Button.Secondary title={title} onClick={onClick} {...props} />
}

Card.Subtitle = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body2 display="block" part="subtitle" {...props}>
      {children}
    </Text.Body2>
  )
}

Card.Title = ({ children, ...props }: TextProps) => {
  if (children == null) return null

  return (
    <Text.Body1 display="block" fontWeight="bold" part="title" {...props}>
      {children}
    </Text.Body1>
  )
}
