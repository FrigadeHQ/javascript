import styled from 'styled-components'

export const FloatingWidgetContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const FloatingWidgetButton = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #f5f5f5;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 45px;
  cursor: pointer;
`
export const FloatingWidgetMenu = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  //gap: 0px;
  padding: 4px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 12px;
`

export const FlowWidgetMenuItem = styled.button`
  display: flex;
  border-radius: 8px;

  :hover {
    background-color: #f5f5f5;
  }

  padding: 8px 12px;
`
