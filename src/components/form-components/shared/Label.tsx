import { FormLabel, LabelWrapper, RequiredSymbol } from './styled'
import { getClassName } from '../../../shared/appearance'
import React from 'react'
import { Appearance } from '../../../types'

export function Label({
  title,
  required,
  appearance,
}: {
  title: string
  required: boolean
  appearance: Appearance
}) {
  return (
    <LabelWrapper>
      {required ? <RequiredSymbol>*</RequiredSymbol> : null}
      <FormLabel className={getClassName('formLabel', appearance)}>{title}</FormLabel>
    </LabelWrapper>
  )
}
