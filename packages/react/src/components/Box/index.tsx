import * as React from 'react'
import { clsx } from 'clsx'

import { type StyleProps } from './styleProps'
import { stylePropsToCss } from './stylePropsToCss'
import { sanitize } from '../../shared/sanitize'

function prefixPart(part: string | undefined) {
  return part ? `fr-${part}` : part
}

function processPart(part: Part | undefined) {
  if (!part) return part

  return Array.isArray(part)
    ? part
        .filter((p) => p != null)
        .map((p) => processPart(p))
        .join(' ')
    : prefixPart(part)
}

type Part = string | Part[]

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
  part?: Part
} & StyleProps &
  React.ComponentPropsWithoutRef<T>

function BoxWithRef<T extends React.ElementType = React.ElementType>(
  { as, children, className, css = {}, part, ...props }: BoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const Component = as ?? 'div'

  const { cssFromProps, unmatchedProps } = stylePropsToCss(props, Component)

  const processedPart = processPart(part)
  const classNameWithPart = className || processedPart ? clsx(className, processedPart) : undefined
  const cssProp = [{ boxSizing: 'border-box' }, cssFromProps, css]

  if (typeof children === 'string') {
    return (
      <Component
        className={classNameWithPart}
        css={cssProp}
        {...unmatchedProps}
        ref={ref}
        dangerouslySetInnerHTML={sanitize(children)}
      />
    )
  }

  return (
    <Component className={classNameWithPart} css={cssProp} {...unmatchedProps} ref={ref}>
      {children}
    </Component>
  )
}

export const Box = React.forwardRef(BoxWithRef) as <
  T extends React.ElementType = React.ElementType
>(
  props: BoxProps<T>
) => React.ReactElement
