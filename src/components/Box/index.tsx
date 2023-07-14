import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import styled, { ThemeProvider, useTheme } from 'styled-components'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  layout,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
} from 'styled-system'
import { deepmerge } from 'deepmerge-ts'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

export type BoxProps<T extends ElementType = 'div'> = {
  as?: T
  css?: Record<string, any> // TODO: Fix any
  children?: ReactNode
  overrides?: Overrides
} & BorderProps &
  ColorProps &
  LayoutProps &
  ShadowProps &
  SpaceProps &
  ComponentPropsWithoutRef<T>

const StyledBox = styled('div')(({ css }) => css, compose(border, color, layout, shadow, space))

export const Box = <T extends React.ElementType = 'div'>({
  as,
  children,
  overrides,
  ...rest
}: BoxProps<T>) => {
  const theme = useTheme()

  const styleResetProps = {
    border: 'none',
    boxSizing: 'border-box',
    m: 0,
    p: 0,
  }

  const renderBox = () => (
    <StyledBox as={as} {...styleResetProps} {...rest}>
      {children}
    </StyledBox>
  )

  if (overrides !== undefined) {
    const newTheme = deepmerge(theme, overrides)

    return <ThemeProvider theme={newTheme}>{renderBox()}</ThemeProvider>
  }

  return renderBox()
}
