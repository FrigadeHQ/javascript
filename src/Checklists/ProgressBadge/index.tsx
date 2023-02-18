import React, { CSSProperties, FC } from 'react'
import { Chevron } from '../../components/Icons/Chevron'
import { ProgressBar } from '../Checklist/Progress'
import { BadgeContainer, BadgeRow, BadgeTitle } from './styled'

interface ProgressBadgeProps {
  title: string
  count: number
  total: number
  style?: CSSProperties
  textStyle?: CSSProperties
  onClick: () => void
  primaryColor?: string
  secondaryColor?: string
  className?: string
}

export const ProgressBadge: FC<ProgressBadgeProps> = ({
  title,
  count,
  total,
  onClick,
  style = {},
  textStyle = {},
  primaryColor = '#000000',
  secondaryColor = '#E6E6E6',
  className,
}) => {
  return (
    <BadgeContainer
      className={className}
      onClick={() => onClick !== undefined && onClick()}
      style={style}
    >
      <BadgeRow>
        <BadgeTitle style={textStyle}>{title}</BadgeTitle>
        {onClick !== undefined && <Chevron color={primaryColor} />}
      </BadgeRow>
      {total && total !== 0 && (
        <ProgressBar
          display="compact"
          count={count}
          total={total}
          fillColor={primaryColor}
          bgColor={secondaryColor}
          textStyle={textStyle}
          style={{ width: '100%' }}
        />
      )}
    </BadgeContainer>
  )
}
