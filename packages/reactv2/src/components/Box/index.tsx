import * as React from 'react'
import { clsx } from 'clsx'

import { sprinkles, Sprinkles } from '../../shared/sprinkles.css'

import '../../shared/theme/baseTheme.css'

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
  children?: React.ReactNode
  className?: string
  style?: Record<string, any>
} & Sprinkles &
  React.ComponentPropsWithoutRef<T>

function BoxWithRef<T extends React.ElementType = React.ElementType>(
  { as, children, className, style, ...props }: BoxProps<T>,
  ref: React.ForwardedRef<T>
) {
  const Component = as ?? 'div'

  const sprinklesProps: Sprinkles = {
    boxSizing: 'border-box',
  }
  const sprinklesPropNames = sprinkles.properties.keys()
  const propNames = Object.keys(props) as Array<keyof typeof props>

  // Split sprinkles props out from unknown props
  for (const sprinklesProp of sprinklesPropNames) {
    if (propNames.includes(sprinklesProp)) {
      Object.assign(sprinklesProps, {
        [sprinklesProp]: props[sprinklesProp],
      })

      delete props[sprinklesProp]
    }
  }

  const classNames = clsx(sprinkles(sprinklesProps), className)

  return (
    // @ts-ignore: Sprinkles color prop type is currently having a struggle
    <Component
      className={classNames.length > 0 ? classNames : undefined}
      style={style}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
}

export const Box = React.forwardRef(BoxWithRef)
