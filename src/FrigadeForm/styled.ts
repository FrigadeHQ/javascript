import styled from 'styled-components'

export const FormCTAContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: ${(props) => (props.showBackButton ? 'space-between' : 'flex-end')};
  padding-top: 14px;
`

export const FormCTAError = styled.div`
  color: ${(props) => props.appearance.theme.colorTextError};
  font-size: 12px;
`

export const CTAWrapper = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
`
export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1;
`

export const FormContainerMain = styled.div`
  display: flex;
  // If type is set to large-modal, use padding 60px horizontal, 80px vertical
  // Otherwise, use 4px padding
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  position: relative;
`

export const FormContainerWrapper = styled.div`
  padding: ${(props) => (props.type === 'large-modal' ? '50px' : '0px')};
  position: relative;
  overflow-y: auto;
`

export const FormContainerSidebarImage = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  flex-basis: 0;
  // If props.image is set, use it as the background image
  background-image: ${(props) => (props.image ? `url(${props.image})` : 'none')};
  // scale background image to fit
  background-size: contain;
  background-position: center;
  border-top-right-radius: ${(props) => props.appearance.theme.borderRadius}px;
  border-bottom-right-radius: ${(props) => props.appearance.theme.borderRadius}px;
`
