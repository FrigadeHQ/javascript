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

export const ModalChecklistTitle = styled.p<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorText};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
`
export const ModalChecklistSubtitle = styled.p<{ appearance }>`
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
  font-weight: 400;
  color: #4d4d4d;
  font-size: 14px;
  line-height: 23px;
  margin: 2px 0 0 0;
`
