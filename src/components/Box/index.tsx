import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, FC, ReactNode } from 'react'
import { assignInlineVars } from '@vanilla-extract/dynamic'

import { theme } from '../../shared/theme.css'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

export type BoxProps<T extends ElementType = 'span'> = {
  as?: T
  children?: ReactNode
  style?: CSSProperties
  overrides?: Overrides
} & ComponentPropsWithoutRef<T>

function walkOverrides(overrides, themeComponents) {
  const replacedOverrides = Object.assign({}, overrides)

  Object.keys(replacedOverrides).forEach((key) => {
    // does themeComponents[key] exist?
    if (themeComponents[key]) {
      // is it an object?
      if (Object.prototype.toString.call(themeComponents[key]) === '[object Object]') {
        replacedOverrides[key] = walkOverrides(overrides[key], themeComponents[key])

        // is it a string?
      } else if (typeof themeComponents[key] === 'string') {
        replacedOverrides[key] = themeComponents[key]
      }
    }
  })

  return replacedOverrides

  // Object.keys(overrides).forEach((key) => {
  //   if (Object.prototype.toString.call(overrides[key]) === '[object Object]') {
  //     return walkOverrides(overrides[key])
  //   } else {

  //   }
  // })
}

export const Box = <T extends React.ElementType = 'span'>({
  as,
  children,
  style,
  overrides,
  ...rest
}: BoxProps<T>) => {
  const Component = as ?? 'span'
  const inlineStyle = style ? assignInlineVars(style as Record<string, string>) : undefined

  if (overrides) {
    // set the inline style prop to the result of walkOverrides
    const lol = walkOverrides(overrides, theme.components)

    console.log('WHAT EVEN: ', lol)
  }

  return (
    <Component style={inlineStyle} {...rest}>
      {children}
    </Component>
  )
}
