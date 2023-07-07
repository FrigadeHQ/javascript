import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, FC, ReactNode } from 'react'
import styled, { ThemeProvider, useTheme } from 'styled-components'
import { deepmerge } from 'deepmerge-ts'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

export type BoxProps<T extends ElementType = 'span'> = {
  as?: T
  css?: Record<string, any> // TODO: Fix any
  children?: ReactNode
  overrides?: Overrides
} & ComponentPropsWithoutRef<T>

const StyledBox = styled.span`
  ${(props) => props.css}
`

export const Box = <T extends React.ElementType = 'span'>({
  as,
  children,
  css,
  overrides,
  ...rest
}: BoxProps<T>) => {
  const Component = as ?? 'span'
  const theme = useTheme()

  if (overrides) {
    const newTheme = deepmerge(theme, overrides)

    return (
      <ThemeProvider theme={newTheme}>
        <StyledBox as={Component} css={css} {...rest}>
          {children}
        </StyledBox>
      </ThemeProvider>
    )
  }

  return (
    <StyledBox as={Component} css={css} {...rest}>
      {children}
    </StyledBox>
  )
}
