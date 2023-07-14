import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import styled, { ThemeProvider, useTheme } from 'styled-components'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  get,
  LayoutProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  system,
  typography,
  TypographyProps,
} from 'styled-system'
import { deepmerge } from 'deepmerge-ts'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

// Drop the size property from layout props, it conflicts with our own size prop
// SEE: https://github.com/styled-system/styled-system/blob/master/packages/layout/src/index.js
const layoutWithoutSize = {
  width: {
    property: 'width',
    scale: 'sizes',
    transform: (n, scale) =>
      get(scale, n, !(typeof n === 'number' && !isNaN(n)) || n > 1 ? n : n * 100 + '%'),
  },
  height: {
    property: 'height',
    scale: 'sizes',
  },
  minWidth: {
    property: 'minWidth',
    scale: 'sizes',
  },
  minHeight: {
    property: 'minHeight',
    scale: 'sizes',
  },
  maxWidth: {
    property: 'maxWidth',
    scale: 'sizes',
  },
  maxHeight: {
    property: 'maxHeight',
    scale: 'sizes',
  },
  overflow: true,
  overflowX: true,
  overflowY: true,
  display: true,
  verticalAlign: true,
}

export type BoxProps<T extends ElementType = 'div'> = {
  as?: T
  css?: Record<string, any> // TODO: Fix any
  children?: ReactNode
  overrides?: Overrides
} & BorderProps &
  ColorProps &
  Exclude<LayoutProps, 'size'> &
  ShadowProps &
  SpaceProps &
  TypographyProps &
  ComponentPropsWithoutRef<T>

const StyledBox = styled('div')(
  ({ css }) => css,
  compose(border, color, shadow, space, typography, system(layoutWithoutSize))
)

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
