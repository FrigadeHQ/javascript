import styled from 'styled-components'

export const SelectListSplitContainer = styled.div<{ appearance }>`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`

export const SelectListSelectionContainer = styled.div`
  width: auto;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const SelectListSplitImageContainer = styled.div<{appearance}>`
  width: 50%;
  background-color: ${(props) => props.appearance?.theme?.colorBackground };
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
`

export const SelectListSplitImageBackground = styled.div<{appearance}>`
  position: absolute;
  width: 120%;
  height: 120%;
  background-color: ${(props) => props.appearance?.theme?.colorBackground };
  opacity: 0.2;
`

export const SelectListHeader = styled.div`
  max-width: 80%;
  min-width: 80%;
  text-align: left;
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

export const SelectItem = styled.div<{hideBottomBorder}>`
  padding-top: 12px;
  padding-bottom: 12px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  border-bottom: ${(props) => props.hideBottomBorder ? 'none' : '1px solid #D8D8D8'};
  max-width: 80%;
  min-width: 80%;
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
  display: flex;
  align-self: center;
`