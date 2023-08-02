import React, { CSSProperties, FC } from 'react'
import { Chevron } from '../../Icons/Chevron'
import { ProgressBar } from '../Checklist/ProgressBar'
import { BadgeContainer, BadgeRow, BadgeTitle, ProgressRingContainer } from './styled'
import { motion } from 'framer-motion'
import { Appearance } from '../../../types'
import ProgressRing from '../../Progress/ProgressRing/ProgressRing'
import { getClassName, mergeClasses } from '../../../shared/appearance'
import { RenderInlineStyles } from '../../RenderInlineStyles'

export type ProgressBadgeType = 'condensed' | 'default' | 'full-width'

export interface ProgressBadgeProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  count: number
  total: number
  style?: CSSProperties
  onClick: () => void
  className?: string
  type?: ProgressBadgeType
  appearance?: Appearance
}

export const MiniProgressBadge: FC<ProgressBadgeProps> = ({
  title,
  count,
  total,
  onClick,
  style = {},
  className,
  appearance,
  type = 'default',
}) => {
  return (
    <>
      <RenderInlineStyles appearance={appearance} />
      <BadgeContainer
        as={motion.div}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick !== undefined && onClick()}
        style={{
          ...(type == 'condensed' ? { display: 'flex', justifyContent: 'space-between' } : {}),
          ...style,
        }}
        className={mergeClasses(className ?? '', getClassName('progressRingContainer', appearance))}
        appearance={appearance}
      >
        {type == 'condensed' && total && total !== 0 && (
          <ProgressRingContainer className={getClassName('progressRingContainer', appearance)}>
            <ProgressRing
              size={19}
              percentage={count / total}
              fillColor={appearance.theme.colorPrimary}
              bgColor={appearance.theme.colorBackgroundSecondary}
            />
          </ProgressRingContainer>
        )}
        <BadgeRow type={type} className={getClassName('badgeTitleContainer', appearance)}>
          <BadgeTitle
            type={type}
            appearance={appearance}
            className={getClassName('badgeTitle', appearance)}
          >
            {title}
          </BadgeTitle>
          {onClick !== undefined && (
            <Chevron
              className={getClassName('badgeChevron', appearance)}
              color={appearance.theme.colorPrimary}
            />
          )}
        </BadgeRow>
        {type == 'default' && total && total !== 0 && (
          <ProgressBar
            display="compact"
            count={count}
            total={total}
            fillColor={appearance.theme.colorPrimary}
            bgColor={appearance.theme.colorBackgroundSecondary}
            style={{ width: '100%' }}
            appearance={appearance}
          />
        )}
      </BadgeContainer>
    </>
  )
}
