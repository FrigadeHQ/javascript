import styled from 'styled-components'

export const BadgeContainer = styled.div<{ primaryColor }>`
  background-color: ${(props) => props.primaryColor};
  border: 1px solid ${(props) => props.primaryColor};
  border-radius: 8px;
  margin: 10px;
  padding: 10px 12px 10px 12px;
`

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BadgeTitle = styled.p<{ color }>`
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => props.color};
`