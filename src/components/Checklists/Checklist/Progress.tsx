import React, { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Appearance } from '../../../types'
import { getClassName, styleOverridesToCSS } from '../../../shared/appearance'

// TODO: remove once secondary color is passed from theme
const PROGRESS_BAR_COLOR_STYLES = {
  backgroundColor: '#E6E6E6',
}

const ChecklistProgressContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.textLocation == 'top' ? 'column' : 'row')};
  justify-content: flex-start;
  align-items: ${(props) => (props.textLocation == 'top' ? 'flex-end' : 'center')};

  ${(props) => styleOverridesToCSS(props)}
`
const ChecklistProgressProgressBar = styled.div`
  flex-grow: 1;
  position: relative;
  ${(props) => (props.textLocation == 'top' ? `width: 100%;` : ``)}
`

const StepText = styled.p<{ padding; appearance }>`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding-right: ${(props) => props.padding};
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
  margin-bottom: ${(props) => (props.textLocation == 'top' ? '8px' : '0px')};
  ${(props) => styleOverridesToCSS(props)}
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
  fillColor,
  bgColor = PROGRESS_BAR_COLOR_STYLES.backgroundColor,
  display = 'count',
  textLocation = 'left',
  style = {},
  textStyle = {},
  appearance,
}: {
  count: number
  total: number
  fillColor?: string
  bgColor?: string
  display?: 'count' | 'percent' | 'compact'
  textLocation?: 'top' | 'left'
  style?: CSSProperties
  textStyle?: CSSProperties
  appearance?: Appearance
}) => {
  if (total === 0) return <></>

  const fgWidth = count === 0 ? '10px' : `${(count / total) * 100}%`
  const barHeight = display === 'compact' ? '5px' : '10px'
  const percentComplete = Math.round((count / total) * 100)
  let padding = display === 'compact' ? '5px' : '20px'

  let stepText
  if (display === 'count') {
    stepText = `${count} of ${total}`
  } else if (display === 'compact') {
    stepText = `${percentComplete}%`
  } else if (display === 'percent') {
    stepText = `${percentComplete}% complete`
  }
  if (textLocation === 'top') {
    padding = '0px'
  }

  return (
    <ChecklistProgressContainer
      className={getClassName('progressBarContainer', appearance)}
      textLocation={textLocation}
      styleOverrides={style}
    >
      <StepText
        className={getClassName('progressBarStepText', appearance)}
        style={{
          ...textStyle,
          fontSize: display === 'compact' ? 12 : 15,
          fontWeight: display === 'compact' ? 400 : 500,
        }}
        appearance={appearance}
        padding={padding}
        textLocation={textLocation}
      >
        {stepText}
      </StepText>
      <ChecklistProgressProgressBar
        textLocation={textLocation}
        className={getClassName('progressBar', appearance)}
      >
        <motion.div
          style={{
            ...progressFgStyle,
            width: fgWidth,
            height: barHeight,
            backgroundColor: appearance?.theme?.colorPrimary ?? fillColor,
            zIndex: display == 'compact' ? 1 : 5,
          }}
          className={getClassName('progressBarFill', appearance)}
        />
        <div
          className={getClassName('progressBarBackground', appearance)}
          style={{
            ...progressBgStyle,
            height: barHeight,
            backgroundColor: appearance?.theme?.colorSecondary ?? bgColor,
          }}
        />
      </ChecklistProgressProgressBar>
    </ChecklistProgressContainer>
  )
}
