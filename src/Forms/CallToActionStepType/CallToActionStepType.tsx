import React from 'react'
import styled from 'styled-components'
import { CustomFormTypeProps, FormInputType } from '../../FrigadeForm/types'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import { TitleSubtitle } from '../../components/TitleSubtitle/TitleSubtitle'

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
    margin-bottom: 32px;
  }
`

const CallToActionTextContainer = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    margin-bottom: 28px;
  }
`

export function CallToActionStepType({
  stepData,
  appearance,
  setCanContinue,
}: CustomFormTypeProps) {
  setCanContinue(true)

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
    </CallToActionStepContainer>
  )
}
