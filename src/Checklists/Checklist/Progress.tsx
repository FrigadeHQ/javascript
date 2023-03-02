import React, { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

const PROGRESS_BAR_COLOR_STYLES = {
  backgroundColor: '#E6E6E6',
  fillColor: '#000000',
}

const ChecklistProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const ChecklistProgressProgressBar = styled.div`
  flex-grow: 1;
  position: relative;
`

const StepText = styled.p<{ padding }>`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding-right: ${(props) => props.padding};
  margin: 0;
`

const progressBgStyle: CSSProperties = {
  position: 'relative',
  left: 0,
  top: 0,
  width: '100%',
  minWidth: '40px',
  height: '10px',
  borderRadius: '20px',
}

const progressFgStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '10px',
  borderRadius: '20px',
}

export const ProgressBar = ({
  count,
  total,
  fillColor = PROGRESS_BAR_COLOR_STYLES.fillColor,
  bgColor = PROGRESS_BAR_COLOR_STYLES.backgroundColor,
  display = 'count',
  style = {},
  textStyle = {},
}: {
  count: number
  total: number
  fillColor?: string
  bgColor?: string
  display?: 'count' | 'percent' | 'compact'
  style?: CSSProperties
  textStyle?: CSSProperties
}) => {
  if (total === 0) return <></>

  const fgWidth = count === 0 ? '10px' : `${(count / total) * 100}%`
  const barHeight = display === 'compact' ? '5px' : '10px'
  const percentComplete = Math.round((count / total) * 100)
  const padding = display === 'compact' ? '5px' : '20px'

  let stepText
  if (display === 'count') {
    stepText = `${count} of ${total}`
  } else if (display === 'compact') {
    stepText = `${percentComplete}%`
  } else if (display === 'percent') {
    stepText = `${percentComplete}% complete`
  }

  return (
    <ChecklistProgressContainer style={style}>
      <StepText
        style={{
          ...textStyle,
          fontSize: display === 'compact' ? 12 : 15,
          fontWeight: display === 'compact' ? 400 : 500,
        }}
        padding={padding}
      >
        {stepText}
      </StepText>
      <ChecklistProgressProgressBar>
        <motion.div
          style={{
            ...progressFgStyle,
            width: fgWidth,
            height: barHeight,
            backgroundColor: fillColor,
            zIndex: display == 'compact' ? 0 : 5,
          }}
        />
        <div style={{ ...progressBgStyle, height: barHeight, backgroundColor: bgColor }} />
      </ChecklistProgressProgressBar>
    </ChecklistProgressContainer>
  )
}
