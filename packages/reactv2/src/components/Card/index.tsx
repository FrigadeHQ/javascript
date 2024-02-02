import * as React from 'react'

import { type BoxProps } from '../Box'
import { Flex } from '../Flex'

export const Card = React.forwardRef(({ as, children, ...props }: BoxProps, ref) => {
  const Component = as ?? Flex.Column
  return (
    <Component backgroundColor="neutral.background" borderRadius="md" p={5} {...props} ref={ref}>
      {children}
    </Component>
  )
})
