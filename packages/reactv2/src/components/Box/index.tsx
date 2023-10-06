import { clsx } from 'clsx'

import { sprinkles, Sprinkles } from '../../shared/sprinkles.css'

export type BoxProps<T extends React.ElementType = React.ElementType> = {
  as?: T
  children?: React.ReactNode
  className?: string
  style?: Record<string, any>
} & Sprinkles

export function Box<T extends React.ElementType = React.ElementType>({
  as,
  children,
  className,
  style,
  ...props
}: BoxProps<T>) {
  const Component = as ?? 'div'

  const sprinklesProps = {}
  const sprinklesPropNames = sprinkles.properties.keys()
  const propNames = Object.keys(props)

  // Split sprinkles props out from unknown props
  for (const sprinklesProp of sprinklesPropNames) {
    if (propNames.includes(sprinklesProp)) {
      sprinklesProps[sprinklesProp] = props[sprinklesProp]
      delete props[sprinklesProp]
    }
  }

  const classNames = clsx(sprinkles(sprinklesProps), className)

  return (
    <Component className={classNames.length > 0 ? classNames : undefined} style={style} {...props}>
      {children}
    </Component>
  )
}
