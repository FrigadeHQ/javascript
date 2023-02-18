import styled from 'styled-components'

export const BadgeContainer = styled.div<{ primaryColor }>`
  border: 1px solid ${(props) => props.primaryColor};
  border-radius: 8px;
  padding: 10px 12px 10px 12px;
  min-width: 160px;
`

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`

export const BadgeTitle = styled.p<{ color }>`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => props.color};
`
