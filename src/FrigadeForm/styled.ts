import styled from 'styled-components'

export const FormCTAContainer = styled.div`
  align-content: flex-end;
  text-align: right;
`
export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const FormCTASplitContainer = styled.div`
  display: flex;
  width: 50%;
  justify-content: center;
  align-content: center;
`
export const FormContainerMain = styled.div`
  display: flex;
  // If type is set to full-screen-modal, use padding 60px horizontal, 80px vertical
  // Otherwise, use 4px padding
  padding: ${(props) => (props.type === 'full-screen-modal' ? '100px 80px' : '4px')};
  flex-direction: column;
  flex: 1;
`

export const FormContainerSidebarImage = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  // If props.image is set, use it as the background image
  background-image: ${(props) => (props.image ? `url(${props.image})` : 'none')};
  // scale background image to fit
  background-size: contain;
  background-position: center;
`
