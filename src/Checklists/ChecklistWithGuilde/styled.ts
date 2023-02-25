import { CSSProperties } from 'react'
import styled from 'styled-components'


// Styles for top level container and text

export const ContainerStyle: CSSProperties = {
  background: '#ffffff',
  boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.06)',
  borderRadius: '6px',
  zIndex: 75,
  padding: '32px'
}

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const ChecklistTitle = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 16px;
`
export const ChecklistSubtitle = styled.p`
  font-weight: 400;
  color: #8c8c8c;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 16px;
`

export const StepsContainer = styled.div`
  border: 1px solid #FAFAFA;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
`

export const StepsHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const StepsTitle = styled.p`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: #8C8C8C;
  margin: 20px;
`

export const StepsBody = styled.div`
  display: flex;
  flex-direction: row;
`

export const StepListContainer = styled.div`
  flex: 1;
`

// Styles for Step content

export const StepContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  flex: 1;
`

export const StepTitle = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 26px;

  text-align: center;
  color: #434343;
  margin-top: 20px;
  margin-bottom: 16px;
`

export const StepSubtitle = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #8C8C8C;
`

export const MultipleButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

`

export const StepListItem = styled.div<{selected: boolean}>`
  padding: 20px;
  background-color: ${(props) => props.selected ? '#FAFAFA' : '#FFFFFF'};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`

export const StepListStepName = styled.p<{selected: boolean}>`
  font-weight: ${(props) => props.selected ? 500 :  400};
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.selected ? '#434343' :  '#BFBFBF'};
`

export const StepListItemRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
`

export const ProgressBarContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
`