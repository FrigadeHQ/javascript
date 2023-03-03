import styled from 'styled-components'
import { getCustomClasOverrides } from '../shared/appearance'

export const FloatingWidgetContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 50;
`

export const FloatingWidgetButton = styled.button`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: #ffffff;
    border: 1px solid #f5f5f5;
  }
  width: 50px;
  height: 50px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 45px;
  cursor: pointer;
`
export const FloatingWidgetMenu = styled.div`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
  }
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: 4px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 22px;
`

export const FlowWidgetMenuItem = styled.button`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    color: #434343;
    :hover {
      background-color: #f5f5f5;
    }
  }

  display: flex;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;

  padding: 8px 12px;
`
