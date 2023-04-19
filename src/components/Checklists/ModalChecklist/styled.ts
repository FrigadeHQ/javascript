import styled from 'styled-components'

export const ModalChecklistContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  z-index: 10;
  padding: 32px;

  position: absolute;
  width: 80%;
  top: 20%;
  left: 20%;

  max-width: 800px;
  min-width: 350px;
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const ModalChecklistTitle = styled.h1<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorText};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
`
export const ModalChecklistSubtitle = styled.h2<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
  margin: 2px 0 0 0;
`
export const ChecklistContainer = styled.div`
  display: block;
  width: 100%;
`
export const CondensedChecklistContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => props.appearance?.theme?.colorBackground};
  border-radius: ${(props) => props.appearance?.theme?.borderRadius}px;
  padding: 24px;
`
