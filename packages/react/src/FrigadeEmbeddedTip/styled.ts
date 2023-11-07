import styled from 'styled-components'
import { getCustomClassOverrides } from '../shared/appearance'

export const EmbeddedTipContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    padding: 28px 18px;
    box-sizing: border-box;
    align-items: unset;
    background-color: ${(props) => props.appearance.theme.colorBackground};
    border-width: 1px;
    border-color: ${(props) => props.appearance.theme.colorBorder};
    border-radius: 12px;
    position: relative;
  }
`
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
export const CallToActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`

export const DismissButton = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`
