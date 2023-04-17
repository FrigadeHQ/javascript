import styled from 'styled-components'
import { Appearance } from '../types'
import { getCustomClassOverrides } from '../shared/appearance'

export const TooltipContainer = styled.div<{ maxWidth: number; appearance: Appearance }>`
  :not(${(props) => getCustomClassOverrides(props)}) {
    background: ${(props) => props.appearance.theme.colorBackground};
  }

  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  max-width: ${(props) => props.maxWidth}px;
  min-width: 300px;
  padding: 22px 30px 12px 22px;
  z-index: ${(props) => props.zIndex};
`

export const TooltipDismissContainer = styled.div`
  display: block;
  cursor: pointer;
  position: absolute;
  right: 22px;
`

export const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`

export const TooltipStepCountContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

export const TooltipCTAContainer = styled.div`
  display: flex;
  flex: 2;
  flex-shrink: 1;
  gap: 8px;
  height: 64px;
  :not(${(props) => getCustomClassOverrides(props)}) {
    flex-direction: row;
    justify-content: ${(props) => (props.showStepCount ? 'flex-end' : 'flex-start')};
    align-content: center;
    align-items: center;
  }
`

export const TooltipStepCounter = styled.p`
  :not(${(props) => getCustomClassOverrides(props)}) {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    color: #808080;
  }
  margin: 0;
`
