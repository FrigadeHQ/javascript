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

  if (overrides !== undefined) {
    const newTheme = deepmerge(theme, overrides)

    return (
      <ThemeProvider theme={newTheme}>
        <Component {...rest}>{children}</Component>
      </ThemeProvider>
    )
  }

  return <Component {...rest}>{children}</Component>
}

export const Box = styled(BaseBox).attrs(({ theme, overrides }) => {
  /*
   * Since the new ThemeProvider will be a child of this Box, the Box itself can't see it.
   * To fix that, we'll manually update the theme prop that it receives to include the overrides.
   */
  if (overrides !== undefined) {
    return {
      theme: deepmerge(theme, overrides),
    }
  }
})(({ css }) => css, compose(border, color, layout))
