import styled from 'styled-components'

export const SelectListSplitContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const SelectListSelectionContainer = styled.div`
  width: auto;
`

export const SelectListSplitImageContainer = styled.div<{appearance}>`
  width: 50%;
  background-color: ${(props) => props.appearance?.theme?.colorBackground };
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const SelectListTitle = styled.h1<{appearance}>`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  color: ${(props) => props.appearance?.theme?.colorText};
`

export const SelectListSubtitle = styled.h1<{appearance}>`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 27px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
`

export const SelectItem = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #D8D8D8;
`

export const SelectItemLeft = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
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
`