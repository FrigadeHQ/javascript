import styled from 'styled-components'

export const BannerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  align-items: center;
  background: {$props => props.appearance.theme.colorBackgroundSecondary};
  border-width: 1px;
  border-color: {$props => props.appearance.theme.colorPrimary};
  border-radius: 12px;
`

export const IconContainer = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
`

export const TextTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: {$props => props.appearance.theme.colorText};
  `

export const TextSubtitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: {$props => props.appearance.theme.colorText};
  `

export const CallToActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
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
