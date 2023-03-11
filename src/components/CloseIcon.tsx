import React from 'react'
import styled from 'styled-components'

const CloseContainer = styled.div`
  :hover {
    opacity: 0.8;
  }
`

export const CloseIcon = ({ size = 12 }) => (
  <CloseContainer>
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      display="inline-block"
      style={{ marginTop: 4 }}
    >
      <rect
        x="10.5879"
        width="1.99651"
        height="14.9738"
        rx="0.998255"
        transform="rotate(45 10.5879 0)"
        fill="currentColor"
      />
      <rect
        y="1.41211"
        width="1.99651"
        height="14.9738"
        rx="0.998255"
        transform="rotate(-45 0 1.41211)"
        fill="currentColor"
      />
    </svg>
  </CloseContainer>
)
