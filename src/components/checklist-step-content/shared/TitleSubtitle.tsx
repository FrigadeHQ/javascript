import React, { FC } from 'react'

import {
  HeroChecklistStepSubtitle,
  HeroChecklistStepTitle,
} from '../../Checklists/HeroChecklist/styled'
import { StepContentProps } from '../../../FrigadeForm/types'
import { sanitize } from '../../../shared/sanitizer'
import { getClassName } from '../../../shared/appearance'

export const TitleSubtitle: FC<StepContentProps> = ({ stepData, appearance }) => {
  return (
    <>
      <HeroChecklistStepTitle
        appearance={appearance}
        className={getClassName('checklistStepTitle', appearance)}
        dangerouslySetInnerHTML={sanitize(stepData.title)}
      />
      <HeroChecklistStepSubtitle
        appearance={appearance}
        className={getClassName('checklistStepSubtitle', appearance)}
        dangerouslySetInnerHTML={sanitize(stepData.subtitle)}
      />
    </>
  )
}
