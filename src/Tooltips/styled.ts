import styled from 'styled-components'

export const TooltipContainer = styled.div<{ maxWidth: number }>`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  max-width: ${(props) => props.maxWidth}px;
  min-width: 300px;
  padding: 10px 18px 10px 18px;
  z-index: 100;
`

export const TooltipHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
  margin-bottom: 12px;
  margin-top: 12px;
  margin-right: 12px;
`

export const TooltipTitle = styled.p`
  display: flex;
  margin: 0;
  font-size: 18px;
`

export const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
`

export const Wrapper = styled.div`
  position: relative;
  overflow: visible;
`

export const TooltipFooterLeft = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

export const TooltipFooterRight = styled.div`
  display: flex;
  flex: 2;
  flex-shrink: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
`

export const TooltipStepCounter = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: #808080;
  margin: 0;
`
