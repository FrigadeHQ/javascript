import React, { FC } from 'react'

import { Body, CarouselProgressBar, ProgressBarLabel } from './styled'
import { getClassName } from '../../../shared/appearance'
import { Appearance } from '../../../types'

interface ProgressBarProps {
  numberOfStepsCompleted: number
  numberOfSteps: number
  appearance?: Appearance
}

export const ProgressBar: FC<ProgressBarProps> = ({
  numberOfStepsCompleted,
  numberOfSteps,
  appearance,
}) => {
  const completionPercentage = numberOfSteps > 0 ? numberOfStepsCompleted / numberOfSteps : 0
  const trackWidth = 200

  return (
    <CarouselProgressBar className={getClassName('carouselProgressBar', appearance)}>
      <ProgressBarLabel as={Body.Loud} style={{ marginRight: 8 }}>
        {numberOfStepsCompleted} of {numberOfSteps}
      </ProgressBarLabel>
      <svg height={10} width="100%" style={{ minWidth: trackWidth }}>
        <rect x={0} y={0} rx={5} width="100%" height={10} fill="#E6E6E6" />
        <rect
          x={0}
          y={0}
          rx={5}
          width={`clamp(10px, 100% * ${completionPercentage}, 100%)`}
          height={10}
          fill="currentColor"
        />
      </svg>
    </CarouselProgressBar>
  )
}
