import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { Appearance } from '../../../types'
import { getClassName, styleOverridesToCSS } from '../../../shared/appearance'
import { ProgressBarBackground, ProgressBarFill } from './styled'

// TODO: remove once secondary color is passed from theme
const PROGRESS_BAR_COLOR_STYLES = {
  backgroundColor: '#E6E6E6',
}

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.textLocation == 'top' ? 'column' : 'row')};
  justify-content: flex-start;
  align-items: ${(props) => (props.textLocation == 'top' ? 'flex-end' : 'center')};
  width: 100%;

  ${(props) => styleOverridesToCSS(props)}
`
const ProgressProgressBar = styled.div`
  flex-grow: 1;
  position: relative;
  ${(props) => (props.textLocation == 'top' ? `width: 100%;` : ``)}
`

const StepText = styled.span<{ padding; appearance }>`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  padding-right: ${(props) => props.padding};
  color: ${(props) => props.appearance?.theme?.colorText};
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

export const ProgressBar = ({
  count,
  total,
  display = 'count',
  textLocation = 'left',
  style = {},
  textStyle = {},
  appearance,
}: {
  count: number
  total: number
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
  let padding = display === 'compact' ? '5px' : '14px'

  let stepText
  if (display === 'count') {
    stepText = `${count}/${total}`
  } else if (display === 'compact') {
    stepText = `${percentComplete}%`
  } else if (display === 'percent') {
    stepText = `${percentComplete}% complete`
  }
  if (textLocation === 'top') {
    padding = '0px'
  }

  return (
    <ProgressContainer
      className={getClassName('progressBarContainer', appearance)}
      textLocation={textLocation}
      styleOverrides={style}
    >
      <StepText
        className={getClassName('progressBarStepText', appearance)}
        style={{
          ...textStyle,
          fontSize: display === 'compact' ? 12 : 14,
          fontWeight: display === 'compact' ? 400 : 600,
        }}
        appearance={appearance}
        padding={padding}
        textLocation={textLocation}
      >
        {stepText}
      </StepText>
      <ProgressProgressBar
        textLocation={textLocation}
        className={getClassName('progressBar', appearance)}
      >
        <ProgressBarFill
          style={{
            zIndex: display == 'compact' ? 1 : 5,
          }}
          fgWidth={fgWidth}
          barHeight={barHeight}
          appearance={appearance}
          className={getClassName('progressBarFill', appearance)}
        />
        <ProgressBarBackground
          className={getClassName('progressBarBackground', appearance)}
          barHeight={barHeight}
          appearance={appearance}
        />
      </ProgressProgressBar>
    </ProgressContainer>
  )
}
