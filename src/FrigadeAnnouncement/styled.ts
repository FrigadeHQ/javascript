import styled from 'styled-components'
import { getCustomClassOverrides } from '../shared/appearance'

export const AnnouncementContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    align-items: unset;
    background-color: ${(props) => props.appearance.theme.colorBackground};
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
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 16px;
`

export const MediaContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`

export const DismissButton = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`
