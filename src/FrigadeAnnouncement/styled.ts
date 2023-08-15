import styled from 'styled-components'
import { getCustomClassOverrides } from '../shared/appearance'

export const AnnouncementContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
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
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 16px;
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

export const HeaderTitle = styled.h1`
  ${(props) => getCustomClassOverrides(props)} {
    font-style: normal;
    justify-content: center;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    line-height: 30px; /* 125% */
    letter-spacing: 0.48px;
    display: flex;
    align-items: center;
    color: ${(props) => props.appearance.theme.colorText};
    margin-bottom: 8px;
  }
`

export const HeaderSubtitle = styled.h2`
  ${(props) => getCustomClassOverrides(props)} {
    font-style: normal;
    justify-content: center;
    text-align: center;
    font-weight: 400;
    color: ${(props) => props.appearance.theme.colorTextSecondary};
    font-size: 16px;
    line-height: 24px; /* 150% */
    letter-spacing: 0.32px;
    margin-bottom: 8px;
  }
`
