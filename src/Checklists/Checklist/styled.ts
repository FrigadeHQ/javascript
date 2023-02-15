import styled from 'styled-components'

export const ChecklistWrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  width: 385px;
  padding: 24px 16px 16px 16px;
`

export const ChecklistHeader = styled.div`
  /* Border bottom only on collapsable  */
`

export const ChecklistHeaderTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
`

export const ChecklistTitle = styled.p`
  display: flex;
  margin: 0;
  font-size: 18px;
`

export const ChecklistSubtitle = styled.p`
  font-size: 15px;
  color: #4d4d4d;
`

export const ChecklistListContainer = styled.ul`
  list-style: none;
`

export const ChecklistListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
`
