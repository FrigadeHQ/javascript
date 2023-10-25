import { HeroChecklistStepContent } from '../Checklists/HeroChecklist/styled'

import React, { FC } from 'react'
import { StepContentProps } from '../../FrigadeForm/types'
import styled from 'styled-components'
import { TitleSubtitleWithCTA } from './shared/TitleSubtitleWithCTA'
import { VideoPlayer } from '../Video/VideoPlayer'
import { getClassName } from '../../shared/appearance'

export const HERO_STEP_CONTENT_TYPE = 'default'
const StepImage = styled.img`
  border-radius: ${(props) => props.appearance?.theme.borderRadius}px;
  width: 100%;
  height: auto;
  min-height: 200px;
`
export const HeroStepContent: FC<StepContentProps> = ({ stepData, appearance }) => {
  if (stepData?.StepContent) {
    const Content: React.ReactNode = stepData.StepContent
    return <div>{Content}</div>
  }

  return (
    <HeroChecklistStepContent className={getClassName('checklistStepContent', appearance)}>
      {stepData.imageUri ? (
        <StepImage
          className={getClassName('checklistStepImage', appearance)}
          src={stepData.imageUri}
          appearance={appearance}
        />
      ) : null}
      {stepData.videoUri ? (
        <VideoPlayer
          videoUri={stepData.videoUri}
          appearance={appearance}
          autoplay={stepData.props?.autoplayVideo}
        />
      ) : null}
      <TitleSubtitleWithCTA stepData={stepData} appearance={appearance} />
    </HeroChecklistStepContent>
  )
}
