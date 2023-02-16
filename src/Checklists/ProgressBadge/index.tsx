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
}

const ProgressBadge: FC<ProgressBadgeProps> = ({
  title,
  count,
  total,
  onClick,
  style = {},
  textStyle = {},
}) => {
  return (
    <BadgeContainer onClick={() => onClick !== undefined && onClick()} style={style}>
      <BadgeRow>
        <BadgeTitle style={textStyle}>{title}</BadgeTitle>
        <Chevron />
      </BadgeRow>
      <BadgeRow>
        {total && total !== 0 && (
          <ProgressBar display="compact" count={count} total={total}></ProgressBar>
        )}
      </BadgeRow>
    </BadgeContainer>
  )
}

export default ProgressBadge