import React, { FC } from 'react'
import styled from 'styled-components'

import { useTheme } from '../hooks/useTheme'
import { Appearance } from '../types'

const Wrapper = styled.div`
  text-align: center;
  color: #e6e6e6;
`

interface FormPaginationProps {
  stepCount: number
  currentStep: number
  appearance: Appearance
  className?: string
}

export const FormPagination: FC<FormPaginationProps> = ({
  stepCount = 0,
  currentStep = 0,
  className,
  appearance,
}) => {
  const { theme } = useTheme().mergeAppearanceWithDefault(appearance)

  return (
    <Wrapper className={className}>
      <svg
        width={16 * stepCount - 8}
        height={8}
        viewBox={`0 0 ${16 * stepCount - 8} 8`}
        fill="none"
      >
        {Array(stepCount)
          .fill(null)
          .map((_, idx) => (
            <rect
              key={idx}
              x={16 * idx}
              y={0}
              width={8}
              height={8}
              rx={4}
              fill={currentStep === idx ? theme.colorPrimary : 'currentColor'}
            />
          ))}
      </svg>
    </Wrapper>
  )
}
