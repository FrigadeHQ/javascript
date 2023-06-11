import React, { FC } from 'react'
import { motion } from 'framer-motion'

const Circle: FC<{ color: string; percentage?: number; size: number }> = ({
  color,
  percentage,
  size,
}) => {
  const r = size * 0.5 - 2
  const circum = 2 * Math.PI * r
  const strokePct = (1 - percentage) * circum // where stroke will start, e.g. from 15% to 100%.

  const transition = {
    duration: 0.3,
    delay: 0,
    ease: 'easeIn',
  }

  const variants = {
    hidden: {
      strokeDashoffset: circum,
      transition,
    },
    show: {
      strokeDashoffset: strokePct,
      transition,
    },
  }

  return (
    <motion.circle
      r={r}
      cx={size * 0.5}
      cy={size * 0.5}
      fill="transparent"
      stroke={strokePct !== circum ? color : ''}
      strokeWidth={'3px'}
      strokeDasharray={circum}
      strokeDashoffset={percentage ? strokePct : 0}
      variants={variants}
      transition={transition}
      initial="hidden"
      animate="show"
    ></motion.circle>
  )
}

interface ProgressRingProps {
  fillColor: string
  size: number
  bgColor?: string
  percentage: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const ProgressRing: FC<ProgressRingProps> = ({
  fillColor,
  size,
  percentage,
  children,
  bgColor = '#D9D9D9',
  className,
  style,
}) => {
  return (
    <svg style={style} className={className} width={size} height={size} overflow="visible">
      <g transform={`rotate(-90 ${`${size * 0.5} ${size * 0.5}`})`}>
        <Circle color={bgColor} size={size} />
        <Circle color={fillColor} percentage={percentage} size={size} />
      </g>
      {children}
    </svg>
  )
}

export default ProgressRing
