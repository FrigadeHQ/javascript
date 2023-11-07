import * as React from 'react'

import '../../shared/theme/baseTheme.css'
import { stylePropsToCss } from './stylePropsToCss'

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
} & React.ComponentPropsWithRef<T>

function BoxWithRef<T extends React.ElementType = React.ElementType>(
  { as, children, css, ...props }: BoxProps<T>,
  ref: React.ForwardedRef<T>
) {
  const Component = as ?? 'div'

  const { cssFromProps, unmatchedProps } = stylePropsToCss(props)

  return (
    // @ts-ignore: TODO: ref types are yet again complaining
    <Component
      css={[{ boxSizing: 'border-box', ...cssFromProps, ...css }]}
      {...unmatchedProps}
      ref={ref}
    >
      {children}
    </Component>
  )
}

export const Box = React.forwardRef(BoxWithRef)
