import React from 'react'

import { Appearance } from '../../types'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import styled from 'styled-components'
import { sanitize } from '../../shared/sanitizer'

const HeaderTitle = styled.h1`
  :not(${(props) => getCustomClassOverrides(props)}) {
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 22px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
`

const HeaderSubtitle = styled.h2`
  :not(${(props) => getCustomClassOverrides(props)}) {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    color: ${(props) => props.appearance.theme.colorTextSecondary};
  }
`

export function TitleSubtitle({
  appearance,
  title,
  subtitle,
}: {
  appearance: Appearance
  title: string
  subtitle: string
}) {
  return (
    <>
      <HeaderTitle
        appearance={appearance}
        className={getClassName('title', appearance)}
        dangerouslySetInnerHTML={sanitize(title)}
      />
      <HeaderSubtitle
        appearance={appearance}
        className={getClassName('subtitle', appearance)}
        dangerouslySetInnerHTML={sanitize(subtitle)}
      />
    </>
  )
}
