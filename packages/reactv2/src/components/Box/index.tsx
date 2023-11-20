import * as React from 'react'
import { clsx } from 'clsx'

import { stylePropsToCss } from './stylePropsToCss'

function prefixPart(part: string | undefined) {
  return part ? `fr-${part}` : part
}

function processPart(part: string | string[] | undefined) {
  if (!part) return part

  return Array.isArray(part) ? part.map((p) => prefixPart(p)).join(' ') : prefixPart(part)
}

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
  part?: string | string[]
} & React.ComponentPropsWithRef<T>

function BoxWithRef<T extends React.ElementType = React.ElementType>(
  { as, children, className, part, ...props }: BoxProps<T>,
  ref: React.ForwardedRef<T>
) {
  const Component = as ?? 'div'

  const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

  const processedPart = processPart(part)
  const classNameWithPart = className || processedPart ? clsx(className, processedPart) : undefined

  const cssProp = [{ boxSizing: 'border-box' }, cssFromProps]

  return (
    // @ts-ignore: TODO: ref types are yet again complaining
    <Component className={classNameWithPart} css={cssProp} {...unmatchedProps} ref={ref}>
      {children}
    </Component>
  )
}

export const Box = React.forwardRef(BoxWithRef)
