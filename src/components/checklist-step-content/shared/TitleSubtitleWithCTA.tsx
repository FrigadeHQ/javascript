import React, { FC } from 'react'
import { StepContentProps } from '../../../FrigadeForm/types'
import { TitleSubtitle } from './TitleSubtitle'
import { CTA } from './CTA'

export const TitleSubtitleWithCTA: FC<StepContentProps> = ({ stepData, appearance }) => {
  return (
    <>
      <TitleSubtitle stepData={stepData} appearance={appearance} />
      <CTA stepData={stepData} appearance={appearance} />
    </>
  )
}
