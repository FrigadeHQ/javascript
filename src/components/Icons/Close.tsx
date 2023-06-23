import React from 'react'
import styled from 'styled-components'

const CloseContainer = styled.div`
  :hover {
    opacity: 0.8;
  }
`

export const Close = () => (
  <CloseContainer>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 15L15 5M5 5l10 10"
      ></path>
    </svg>
  </CloseContainer>
)
