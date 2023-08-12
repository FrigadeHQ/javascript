import React from 'react'

import { Appearance } from '../../types'
import { getClassName, getCustomClassOverrides, ucFirst } from '../../shared/appearance'
import styled from 'styled-components'
import { sanitize } from '../../shared/sanitizer'

const HeaderTitle = styled.h1`
  ${(props) => getCustomClassOverrides(props)} {
    font-style: normal;
    font-weight: 700;
    font-size: ${(props) => (props.size == 'small' ? '15px' : '18px')};
    line-height: ${(props) => (props.size == 'small' ? '22px' : '24px')};
    letter-spacing: 0.36px;
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
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.28px;
    color: ${(props) => props.appearance.theme.colorTextSecondary};
  }
`

export function TitleSubtitle({
  appearance,
  title,
  subtitle,
  size = 'medium',
  classPrefix = '',
}: {
  appearance: Appearance
  title: string
  subtitle?: string
  size?: 'small' | 'medium' | 'large'
  classPrefix?: string
}) {
  return (
    <>
      <HeaderTitle
        appearance={appearance}
        className={getClassName(
          `${classPrefix}${classPrefix ? ucFirst(size) : size}Title`,
          appearance
        )}
        dangerouslySetInnerHTML={sanitize(title)}
        size={size}
      />
      {subtitle && (
        <HeaderSubtitle
          appearance={appearance}
          className={getClassName(
            `${classPrefix}${classPrefix ? ucFirst(size) : size}Subtitle`,
            appearance
          )}
          dangerouslySetInnerHTML={sanitize(subtitle)}
          size={size}
        />
      )}
    </>
  )
}
