import React from 'react'

import { Appearance } from '../../types'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import styled from 'styled-components'
import { sanitize } from '../../shared/sanitizer'

const HeaderTitle = styled.h1`
  ${(props) => getCustomClassOverrides(props)} {
    font-style: normal;
    font-weight: 600;
    font-size: ${(props) => (props.size == 'small' ? '15px' : '18px')};
    line-height: ${(props) => (props.size == 'small' ? '20px' : '22px')};
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    color: ${(props) => props.appearance.theme.colorText};
  }
`

const HeaderSubtitle = styled.h2`
  ${(props) => getCustomClassOverrides(props)} {
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
  size = 'medium',
}: {
  appearance: Appearance
  title: string
  subtitle: string
  size?: 'small' | 'medium' | 'large'
}) {
  return (
    <>
      <HeaderTitle
        appearance={appearance}
        className={getClassName(`${size}Title`, appearance)}
        dangerouslySetInnerHTML={sanitize(title)}
        size={size}
      />
      <HeaderSubtitle
        appearance={appearance}
        className={getClassName(`${size}Subtitle`, appearance)}
        dangerouslySetInnerHTML={sanitize(subtitle)}
        size={size}
      />
    </>
  )
}
