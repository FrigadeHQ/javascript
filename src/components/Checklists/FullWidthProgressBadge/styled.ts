import styled from 'styled-components'
import { getCustomClassOverrides } from '../../../shared/appearance'

export const FullWidthProgressBadgeContainer = styled.div`
  // use the :not annotation
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    align-items: center;
    background-color: ${(props) => props.appearance.theme.colorBackground};
    border-width: 1px;
    border-color: ${(props) => props.appearance.theme.colorPrimary};
    border-radius: 12px;
  }
`

export const IconContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    width: 36px;
    height: 36px;
    margin-right: 16px;
  }
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 0;
`
export const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  min-width: 200px;
`

export const DismissButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-left: 16px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
