import { HeroChecklistStepContent } from '../Checklists/HeroChecklist/styled'

import React, { FC } from 'react'
import { StepContentProps } from '../../FrigadeForm/types'
import styled from 'styled-components'
import { TitleSubtitleWithCTA } from './shared/TitleSubtitleWithCTA'
import { VideoPlayer } from '../Video/VideoPlayer'

export const HERO_STEP_CONTENT_TYPE = 'default'
const StepImage = styled.img`
  border-radius: 4px;
  max-height: 260px;
  min-height: 200px;
`
export const HeroStepContent: FC<StepContentProps> = ({ stepData, appearance }) => {
  if (stepData?.StepContent) {
    const Content: React.ReactNode = stepData.StepContent
    return <div>{Content}</div>
  }

  return (
    <HeroChecklistStepContent>
      {stepData.imageUri ? <StepImage src={stepData.imageUri} style={stepData.imageStyle} /> : null}
      {stepData.videoUri ? <VideoPlayer videoUri={stepData.videoUri} /> : null}
      <TitleSubtitleWithCTA stepData={stepData} appearance={appearance} />
    </HeroChecklistStepContent>
  )
}
