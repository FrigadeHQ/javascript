import styled from 'styled-components'

export const BadgeContainer = styled.div`
  border: 1px solid ${(props) => props.appearance.theme.colorBorder};
  border-radius: 8px;
  padding: 6px 10px 6px 10px;
  min-width: 160px;
  cursor: pointer;
  background-color: ${(props) => props.appearance.theme.colorBackground}};
`

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  flex-grow: 2;
`

export const BadgeTitle = styled.div<{ color; type }>`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin-right: ${(props) => (props.type === 'condensed' ? '8px' : '0')};
  text-align: ${(props) => (props.type === 'condensed' ? 'left' : 'right')};
  color: ${(props) => props.appearance.theme.colorPrimary};
`
export const ProgressRingContainer = styled.div`
  width: 20px;
  margin-right: 8px;
  display: flex;
  height: 100%;
  align-items: center;
`
