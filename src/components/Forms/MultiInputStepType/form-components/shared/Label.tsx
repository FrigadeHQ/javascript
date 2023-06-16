import { FormLabel, LabelWrapper, RequiredSymbol } from './styled'
import { getClassName } from '../../../../../shared/appearance'
import React from 'react'
import { Appearance, DefaultAppearance } from '../../../../../types'

export function Label({
  title,
  required,
  appearance = DefaultAppearance,
}: {
  title?: string
  required: boolean
  appearance?: Appearance
}) {
  if (!title) {
    return null
  }

  return (
    <LabelWrapper>
      {required ? (
        <RequiredSymbol
          className={getClassName('formLabelRequired', appearance)}
          appearance={appearance}
        >
          *
        </RequiredSymbol>
      ) : null}
      <FormLabel className={getClassName('formLabel', appearance)}>{title}</FormLabel>
    </LabelWrapper>
  )
}
