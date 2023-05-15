import React, { FC } from 'react'

import { Body } from './styled'

interface ProgressBarProps {
  numberOfStepsCompleted: number
  numberOfSteps: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ numberOfStepsCompleted, numberOfSteps }) => {
  const completionPercentage = numberOfSteps > 0 ? numberOfStepsCompleted / numberOfSteps : 0
  const trackWidth = 200
  const barWidth = Math.min(trackWidth, Math.max(10, Math.round(trackWidth * completionPercentage)))

  return (
    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
      <Body.Loud style={{ marginRight: 8 }}>
        {numberOfStepsCompleted} of {numberOfSteps}
      </Body.Loud>
      <svg height={10} width={trackWidth}>
        <rect x={0} y={0} rx={5} width={trackWidth} height={10} fill="#E6E6E6" />
        <rect x={0} y={0} rx={5} width={barWidth} height={10} fill="#0B93FF" />
      </svg>
    </div>
  )
}
