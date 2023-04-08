import React from 'react'
import styled from 'styled-components'

const CloseContainer = styled.div`
  :hover {
    opacity: 0.8;
  }
`

export const Close = () => (
  <CloseContainer>
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        y="1.39844"
        width="1.97669"
        height="17.8213"
        rx="0.988346"
        transform="rotate(-45 0 1.39844)"
        fill="currentColor"
      />
      <rect
        x="12.6023"
        width="1.97669"
        height="17.8213"
        rx="0.988346"
        transform="rotate(45 12.6023 0)"
        fill="currentColor"
      />
    </svg>
  </CloseContainer>
)
