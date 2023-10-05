import { clsx } from 'clsx'

import { sprinkles, Sprinkles } from '../../shared/sprinkles.css'

interface BoxProps extends Sprinkles {
  children?: React.ReactNode
  className?: string
}

export const Box = ({ children, className, ...props }: BoxProps) => {
  return <div className={clsx(sprinkles(props), className)}>{children}</div>
}
