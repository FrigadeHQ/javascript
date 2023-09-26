import { FormSubLabel, LabelWrapper } from './styled'
import { getClassName } from '../../../../../shared/appearance'
import React from 'react'
import { Appearance } from '../../../../../types'

export function SubLabel({ title, appearance }: { title?: string; appearance: Appearance }) {
  if (!title) {
    return null
  }

  return (
    <LabelWrapper>
      <FormSubLabel className={getClassName('formSubLabel', appearance)}>{title}</FormSubLabel>
    </LabelWrapper>
  )
}
