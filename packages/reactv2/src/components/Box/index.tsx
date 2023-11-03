import * as React from 'react'

import '../../shared/theme/baseTheme.css'

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
} & React.ComponentPropsWithoutRef<T>

function BoxWithRef<T extends React.ElementType = React.ElementType>(
  { as, children, css, ...props }: BoxProps<T>,
  ref: React.ForwardedRef<T>
) {
  const Component = as ?? 'div'

  return (
    // @ts-ignore: TODO: ref types are yet again complaining
    <Component css={[{ boxSizing: 'border-box' }, css]} {...props} ref={ref}>
      {children}
    </Component>
  )
}

export const Box = React.forwardRef(BoxWithRef)
