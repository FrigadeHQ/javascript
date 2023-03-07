import React, { CSSProperties, FC } from 'react'
import { Chevron } from '../../components/Icons/Chevron'
import { ProgressBar } from '../Checklist/Progress'
import { BadgeContainer, BadgeRow, BadgeTitle, ProgressRingContainer } from './styled'
import { motion } from 'framer-motion'
import { Appearance } from '../../types'
import ProgressRing from '../../components/Progress/ProgressRing/ProgressRing'

export type ProgressBadgeType = 'condensed' | 'default'
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
  type?: ProgressBadgeType
  appearance?: Appearance
}

export const ProgressBadge: FC<ProgressBadgeProps> = ({
  title,
  count,
  total,
  onClick,
  style = {},
  textStyle = {},
  className,
  appearance,
  type,
}) => {
  return (
    <BadgeContainer
      as={motion.div}
      whileHover={{ opacity: 0.9 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={() => onClick !== undefined && onClick()}
      style={{
        ...(type == 'condensed' ? { display: 'flex', justifyContent: 'space-between' } : {}),
        ...style,
      }}
    >
      {type == 'condensed' && total && total !== 0 && (
        <ProgressRingContainer>
          <ProgressRing
            size={19}
            percentage={count / total}
            fillColor={appearance.theme.colorPrimary}
            bgColor={appearance.theme.colorBackgroundSecondary}
          />
        </ProgressRingContainer>
      )}
      <BadgeRow type={type}>
        <BadgeTitle type={type} style={textStyle} appearance={appearance}>
          {title}
        </BadgeTitle>
        {onClick !== undefined && <Chevron color={appearance.theme.colorPrimary} />}
      </BadgeRow>
      {type == 'default' && total && total !== 0 && (
        <ProgressBar
          display="compact"
          count={count}
          total={total}
          fillColor={appearance.theme.colorPrimary}
          bgColor={appearance.theme.colorBackgroundSecondary}
          textStyle={textStyle}
          style={{ width: '100%' }}
        />
      )}
    </BadgeContainer>
  )
}
