import React, { CSSProperties } from 'react'
import styled from 'styled-components';

const ChevronSVG = styled.svg`
  transition: 'transform 0.35s ease-in-out';
`

export const Chevron = ({ color = "#323232", style }: { color?: string, style?: CSSProperties }) => (
  <ChevronSVG width="7" height="10" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M1 13L7.5 7L0.999999 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </ChevronSVG>
)