import styled from 'styled-components'
import { Appearance } from '../../types'
import { getCustomClassOverrides } from '../../shared/appearance'

export const TooltipContainer = styled.div<{ maxWidth: number; appearance: Appearance }>`
  ${(props) => getCustomClassOverrides(props)} {
    background: ${(props) => props.appearance.theme.colorBackground};
  }

  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
  max-width: ${(props) => props.maxWidth}px;
  min-width: 300px;
  z-index: ${(props) => props.zIndex};
  overflow: hidden;
`
const dismissWithImageStyle = `
  display: block;
  cursor: pointer;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  padding: 4px;
  border-radius: 100px;
  top: 12px;
  right: 12px;
  box-sizing: border-box;
  :hover {
    opacity: 0.8;
  }`

const dismissWithoutImageStyle = `
  display: block;
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: transparent;
  border: none;
  `

export const TooltipDismissButton = styled.button`
  ${(props) => getCustomClassOverrides(props)} {
    ${(props) => (props.hasImage ? dismissWithImageStyle : dismissWithoutImageStyle)};
  }
`

export const TooltipImageContainer = styled.img`
  ${(props) => getCustomClassOverrides(props)} {
    display: block;
    width: 100%;
    height: auto;
    min-height: 200px;
    object-fit: cover;
  }
`

export const TooltipVideoContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: block;
    width: 100%;
    height: auto;
    margin-top: ${(props) => (props.dismissible ? '24px' : '0px')};
    object-fit: cover;
  }
`

export const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`

export const TooltipContentContainer = styled.div`
  padding: 22px 22px 12px;
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
  ${(props) => getCustomClassOverrides(props)} {
    flex-direction: row;
    justify-content: ${(props) => (props.showStepCount ? 'flex-end' : 'flex-start')};
    align-content: center;
    align-items: center;
  }
`

export const TooltipStepCounter = styled.p`
  ${(props) => getCustomClassOverrides(props)} {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    color: #808080;
  }
  margin: 0;
`
