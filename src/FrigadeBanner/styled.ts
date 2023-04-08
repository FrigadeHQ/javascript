import styled from 'styled-components'

export const BannerContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.type === 'square' ? 'column' : 'row')};
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  align-items: ${(props) => (props.type === 'square' ? 'unset' : 'center')};
  background-color: ${(props) => props.appearance.theme.colorBackgroundSecondary};
  border-width: 1px;
  border-color: ${(props) => props.appearance.theme.colorPrimary};
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
  margin-left: ${(props) => (props.type === 'square' ? '0px' : '16px')};
  margin-top: ${(props) => (props.type === 'square' ? '12px' : '0')};
`
export const CallToActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: ${(props) => (props.type === 'square' ? '0px' : '16px')};
`

export const DismissButton = styled.div`
  display: flex;
  justify-content: ${(props) => (props.type === 'square' ? 'flex-end' : 'center')};
  align-items: flex-end;
  margin-left: ${(props) => (props.type === 'square' ? '0px' : '16px')};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

export const DismissButtonContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.type === 'square' ? 'flex-end' : 'center')};
  align-items: flex-end;
  margin-left: ${(props) => (props.type === 'square' ? '0px' : '16px')};
`
