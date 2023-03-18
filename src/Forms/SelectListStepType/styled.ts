import styled from 'styled-components'

export const SelectListSelectionContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
`

export const SelectListHeader = styled.div`
  width: 100%;
  text-align: left;
`

export const SelectListTitle = styled.h1<{ appearance }>`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  color: ${(props) => props.appearance?.theme?.colorText};
`

export const SelectListSubtitle = styled.h1<{ appearance }>`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
`

export const SelectItem = styled.div<{ hideBottomBorder }>`
  padding-top: 12px;
  padding-bottom: 12px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  cursor: pointer;
  border-bottom: ${(props) => (props.hideBottomBorder ? 'none' : '1px solid #D8D8D8')};
  width: 100%;
`

export const SelectItemLeft = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  display: flex;
  justify-content: flex-start;
`

export const ItemIcon = styled.img`
  width: 42px;
  height: 42px;
  margin-right: 12px;
`

export const SelectItemText = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  color: ${(props) => props.appearance?.theme?.colorText};
  display: flex;
  align-self: center;
`
