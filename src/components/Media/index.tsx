import { Appearance, StepData } from '../../types'
import { VideoCard } from '../Video/VideoCard'
import React from 'react'
import styled from 'styled-components'
import { getClassName } from '../../shared/appearance'

export const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

export function Media({
  stepData,
  appearance,
  classPrefix = '',
}: {
  stepData: StepData
  appearance: Appearance
  classPrefix?: string
}) {
  if (stepData.videoUri) {
    return <VideoCard appearance={appearance} videoUri={stepData.videoUri} />
  }

  if (stepData.imageUri) {
    return (
      <Image
        className={getClassName(`${classPrefix}image`, appearance)}
        appearance={appearance}
        src={stepData.imageUri}
      />
    )
  }

  return null
}
