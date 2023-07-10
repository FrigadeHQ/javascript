import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import styled, { ThemeProvider, useTheme } from 'styled-components'
import { border, BorderProps, color, ColorProps, compose, layout, LayoutProps } from 'styled-system'
import { deepmerge } from 'deepmerge-ts'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

export type BoxProps<T extends ElementType = 'span'> = {
  as?: T
  css?: Record<string, any> // TODO: Fix any
  children?: ReactNode
  overrides?: Overrides
} & BorderProps &
  ColorProps &
  LayoutProps &
  ComponentPropsWithoutRef<T>

// TODO: Props for each component (like Button) should be extended from styled box so they have all of the styled-system props
// This means Box itself shouldn't have a wrapper, it should be the StyledBox component
// Then we can add the appearance prop and have a custom styled-system interpolation function for it that maps it over

const BaseBox = <T extends React.ElementType = 'span'>({
  as,
  children,
  overrides,
  ...rest
}: BoxProps<T>) => {
  const Component = as ?? 'span'
  const theme = useTheme()

  console.log('PROPS IN BOX: ', as, overrides, rest)

  if (overrides) {
    console.log('OVERRIDING: ', overrides)
    const newTheme = deepmerge(theme, overrides)

    return (
      <ThemeProvider theme={newTheme}>
        <Component {...rest}>{children}</Component>
      </ThemeProvider>
    )
  } else {
    console.log('NO OVERRIDES')
  }

  return <Component {...rest}>{children}</Component>
}

export const Box = styled(BaseBox)(({ css }) => css, compose(border, color, layout))
