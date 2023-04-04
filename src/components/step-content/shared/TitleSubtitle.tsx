import React, { FC } from 'react'

import {
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../../Checklists/HeroChecklist/styled'
import { StepContentProps } from '../../../FrigadeForm/types'
import { sanitize } from '../../../shared/sanitizer'

export const TitleSubtitle: FC<StepContentProps> = ({ stepData, appearance }) => {
  return (
    <>
      <HeroChecklistStepTitle
        appearance={appearance}
        dangerouslySetInnerHTML={sanitize(stepData.title)}
      />
      <HeroChecklistStepSubtitle
        appearance={appearance}
        dangerouslySetInnerHTML={sanitize(stepData.subtitle)}
      />
    </>
  )
}
