import React from 'react'

import {
  FullWidthProgressBadgeContainer,
  IconContainer,
  ProgressBarContainer,
  TextContainer,
} from './styled'
import { ProgressBadgeProps } from '../MiniProgressBadge'
import { TitleSubtitle } from '../../TitleSubtitle/TitleSubtitle'
import { getClassName, mergeClasses } from '../../../shared/appearance'
import { ProgressBar } from '../Checklist/ProgressBar'

export const FullWidthProgressBadge: React.FC<ProgressBadgeProps> = ({
  title,
  subtitle,
  icon,
  appearance,
  count,
  total,
  className,
  style,
  onClick,
}) => {
  return (
    <>
      <FullWidthProgressBadgeContainer
        appearance={appearance}
        className={mergeClasses(
          getClassName('fullWidthProgressBadgeContainer', appearance),
          className ?? ''
        )}
        style={style}
        onClick={() => onClick !== undefined && onClick()}
      >
        {icon && (
          <IconContainer className={getClassName('fullWidthProgressBadgeIcon', appearance)}>
            {icon}
          </IconContainer>
        )}
        <TextContainer>
          <TitleSubtitle size={'small'} appearance={appearance} title={title} subtitle={subtitle} />
        </TextContainer>
        <ProgressBarContainer
          className={getClassName('fullWidthProgressBadgeProgressContainer', appearance)}
        >
          <ProgressBar count={count} total={total} display="percent" textLocation="top" />
        </ProgressBarContainer>
      </FullWidthProgressBadgeContainer>
    </>
  )
}
