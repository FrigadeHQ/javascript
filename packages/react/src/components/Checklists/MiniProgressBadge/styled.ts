import styled from 'styled-components'
import { styleOverridesToCSS } from '../../../shared/appearance'

export const BadgeContainer = styled.div`
  border: 1px solid ${(props) => props.appearance.theme.colorBorder};
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
  padding: 10px 12px 10px 12px;
  min-width: 160px;
  cursor: pointer;
  background-color: ${(props) => props.appearance.theme.colorBackground}};
  ${(props) => styleOverridesToCSS(props)}
  
  &:hover {
    filter: brightness(.99);
  }
`

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.type === 'condensed' ? '0' : '6px')};
  flex-grow: 2;
`

export const BadgeTitle = styled.div<{ color; type }>`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin-right: ${(props) => (props.type === 'condensed' ? '8px' : '0')};
  text-align: ${(props) => (props.type === 'condensed' ? 'left' : 'right')};
`
export const ProgressRingContainer = styled.div`
  width: 20px;
  margin-right: 8px;
  display: flex;
  height: 100%;
  align-items: center;
`
