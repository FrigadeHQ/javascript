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

const StyledBox = styled('span')(({ css }) => css, compose(border, color, layout))

export const Box = <T extends React.ElementType = 'span'>({
  as,
  children,
  overrides,
  ...rest
}: BoxProps<T>) => {
  const theme = useTheme()

  if (overrides !== undefined) {
    const newTheme = deepmerge(theme, overrides)

    return (
      <ThemeProvider theme={newTheme}>
        <StyledBox as={as} {...rest}>
          {children}
        </StyledBox>
      </ThemeProvider>
    )
  }

  return (
    <StyledBox as={as} {...rest}>
      {children}
    </StyledBox>
  )
}
