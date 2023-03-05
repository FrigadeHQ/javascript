import styled from 'styled-components'

export const HeroChecklistStepContent = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
`

export const HeroChecklistStepTitle = styled.p<{appearance}>`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  margin: 20px 0px 0px 0px;
  color: ${(props) => props.appearance?.theme?.colorText};
`

export const HeroChecklistStepSubtitle = styled.p<{appearance}>`
  font-weight: 400;
  font-size: 15px;
  line-height: 28px;
  max-width: 540px;
  margin: 8px 0px 0px 0px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
`

export const StepItemSelectedIndicator = styled.div`
  width: 4px;
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`

export const ChecklistStepItem = styled.div`
  flex-direction: row;
  justify-content: flex-start;
`
