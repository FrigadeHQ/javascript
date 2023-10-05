import { clsx } from 'clsx'

import { sprinkles, Sprinkles } from '../../shared/sprinkles.css'

interface BoxProps extends Sprinkles {
  children?: React.ReactNode
  className?: string
  style?: Record<string, any>
}

export const Box = ({ children, className, style, ...props }: BoxProps) => {
  return (
    <div className={clsx(sprinkles(props), className)} style={style}>
      {children}
    </div>
  )
}
