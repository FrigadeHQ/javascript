import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CustomFormTypeProps, FormInputType } from '../../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../../shared/appearance'
import { TitleSubtitle } from '../../TitleSubtitle/TitleSubtitle'
import { VideoCard } from '../../Video/VideoCard'

interface CallToActionStepProps {
  data?: FormInputType[]
}

// create flex that wraps if not enoug space
const CallToActionStepContainer = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const CallToActionImage = styled.img`
  :not(${(props) => getCustomClassOverrides(props)}) {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`

const CallToActionTextContainer = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    margin-bottom: 24px;
  }
`

const CallToActionVideo = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    width: 100%;
    height: auto;
    max-height: 250px;
    margin-bottom: 24px;
  }
`

export function CallToActionStepType({
  stepData,
  appearance,
  setCanContinue,
}: CustomFormTypeProps) {
  useEffect(() => {
    setCanContinue(true)
  }, [])

  return (
    <CallToActionStepContainer className={getClassName('callToActionContainer', appearance)}>
      <CallToActionTextContainer className={getClassName('callToActionTextContainer', appearance)}>
        <TitleSubtitle
          appearance={appearance}
          title={stepData.title}
          subtitle={stepData.subtitle}
        />
      </CallToActionTextContainer>
      {stepData.imageUri && (
        <CallToActionImage
          className={getClassName('callToActionImage', appearance)}
          src={stepData.imageUri}
        />
      )}
      {!stepData.imageUri && stepData.videoUri && (
        <CallToActionVideo
          appearance={appearance}
          className={getClassName('callToActionVideo', appearance)}
        >
          <VideoCard appearance={appearance} videoUri={stepData.videoUri} />
        </CallToActionVideo>
      )}
    </CallToActionStepContainer>
  )
}
