import React, { FC } from 'react'

import {
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../../Checklists/HeroChecklist/styled'
import { StepContentProps } from '../../../FrigadeForm/types'

export const TitleSubtitle: FC<StepContentProps> = ({ stepData, appearance }) => {
  return (
    <>
      <HeroChecklistStepTitle appearance={appearance}>{stepData.title}</HeroChecklistStepTitle>
      <HeroChecklistStepSubtitle appearance={appearance}>
        {stepData.subtitle}
      </HeroChecklistStepSubtitle>
    </>
  )
}
