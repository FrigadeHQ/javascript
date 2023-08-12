import styled from 'styled-components'
import { getCustomClassOverrides } from '../shared/appearance'

export const NPSSurveyContainer = styled.div`
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
    border-radius: ${(props) => props.appearance.theme.borderRadius}px;
    position: ${(props) => (props.type == 'modal' ? 'fixed' : 'relative')};
    left: 50%;
    transform: translate(-50%);
    bottom: 24px;
    z-index: 1000;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 550px;
  }
`

export const NPSNumberButton = styled.button`
  border: 1px solid ${(props) => props.appearance.theme.colorBorder};
  border-radius: 8px;
  // If selected make border color primary and text color color priamry
  border-color: ${(props) =>
    props.selected ? props.appearance.theme.colorPrimary : props.appearance.theme.colorBorder};
  color: ${(props) =>
    props.selected ? props.appearance.theme.colorPrimary : props.appearance.theme.colorText};
  :hover {
    border-color: ${(props) => props.appearance.theme.colorPrimary};
  }
  :focus {
    border-color: ${(props) => props.appearance.theme.colorPrimary};
    color: ${(props) => props.appearance.theme.colorPrimary};
  }
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const NPSNumberButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
`

export const NPSLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`

export const NPSLabel = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => props.appearance.theme.colorTextDisabled};
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.24px;
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

export const TextArea = styled.textarea`
  ${(props) => getCustomClassOverrides(props)} {
    margin-top: 16px;
    border: 1px solid ${(props) => props.appearance.theme.colorBorder};
    border-radius: ${(props) => props.appearance.theme.borderRadius}px;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 24px;
    width: 100%;
    height: 100px;
  }
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
