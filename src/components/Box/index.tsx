import React, { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import styled, { ThemeProvider, useTheme } from 'styled-components'
import { border, color, layout } from 'styled-system'
import { deepmerge } from 'deepmerge-ts'

interface Overrides extends Record<string, Overrides | CSSProperties> {}

export type BoxProps<T extends ElementType = 'span'> = {
  as?: T
  css?: Record<string, any> // TODO: Fix any
  children?: ReactNode
  overrides?: Overrides
} & ComponentPropsWithoutRef<T>

const StyledBox = styled.span`
  ${border}
  ${color}
  ${layout}
  ${(props) => props.css}
`

// TODO: Props for each component (like Button) should be extended from styled box so they have all of the styled-system props
// This means Box itself shouldn't have a wrapper, it should be the StyledBox component
// Then we can add the appearance prop and have a custom styled-system interpolation function for it that maps it over

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
