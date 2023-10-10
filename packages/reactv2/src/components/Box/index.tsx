import { clsx } from 'clsx'
import { useContext } from 'react'
import { assignInlineVars } from '@vanilla-extract/dynamic'

import { FrigadeContext } from '../Provider'

import { deepmerge } from '../../shared/deepmerge'
import { sprinkles, Sprinkles } from '../../shared/sprinkles.css'
import { themeContract } from '../../shared/theme/themeContract.css'
import { tokens } from '../../shared/tokens'
import { baseTheme } from '../../shared/theme/baseTheme.css'

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
  const { theme } = useContext(FrigadeContext)

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

  const classNames = clsx(baseTheme, sprinkles(sprinklesProps), className)

  console.log('THEME: ', themeContract.colors.blue500)

  // TODO: Add user-provided style prop back in

  /*
  TODO: OK FIGURED IT OUT I THINK -- FROM THE THEME, WE ONLY DEFINE THE VARS WE WANT TO OVERWRITE

  THEN WE DO IT LIKE BELOW: MAP THROUGH OVERRIDDEN VARS, REDEFINE THEM BASED ON THE VALUE FROM THE PROVIDER

  WE SHOULD PROBABLY MOVE THIS UP TO GLOBAL VARS, THEN OVERRIDE THEM INLINE THERE ONCE

  SO SHIT DOESN'T BUILD UP ON EVERY <Box>
  */

  return (
    <Component
      className={classNames.length > 0 ? classNames : undefined}
      style={assignInlineVars({
        [themeContract.colors.primary.background]: theme.colors.primary.background,
      })}
      {...props}
    >
      {children}
    </Component>
  )
}
