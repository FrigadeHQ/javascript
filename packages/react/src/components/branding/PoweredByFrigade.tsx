import React from 'react'
import FrigadeLogo from '../Icons/FrigadeLogo'
import { Appearance } from '../../types'
import { PoweredByFrigadeContainer } from './styled'
import { getClassName } from '../../shared/appearance'

export function PoweredByFrigade({ appearance }: { appearance: Appearance }) {
  return (
    <PoweredByFrigadeContainer
      className={getClassName('poweredByFrigadeContainer', appearance)}
      appearance={appearance}
    >
      Powered by &nbsp;
      <FrigadeLogo />
    </PoweredByFrigadeContainer>
  )
}
