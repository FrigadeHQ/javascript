import styled from 'styled-components'

export const StepContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 2px 20px 2px 20px;
  display: flex;
  margin-top: 14px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  transition: max-height 0.25s;
`

export const StepHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const StepTitle = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  margin-left: 8px;
`

export const CollapseChevronContainer = styled.div`
  padding: 20px;
`

export const ExpandedContentContainer = styled.div``

export const StepSubtitle = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #4d4d4d;
`

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
