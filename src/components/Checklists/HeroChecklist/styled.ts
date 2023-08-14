import styled from 'styled-components'

export const HeroChecklistStepContent = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
`

export const HeroChecklistStepTitle = styled.p<{ appearance }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin: 20px 0px 0px 0px;
  letter-spacing: 0.32px;
  font-style: normal;
  color: ${(props) => props.appearance?.theme?.colorText};
`

export const HeroChecklistStepSubtitle = styled.p<{ appearance }>`
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 22px;
  max-width: 540px;
  letter-spacing: 0.28px;
  margin: 8px 0px 0px 0px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
`

export const StepItemSelectedIndicator = styled.div`
  width: 6px;
  position: absolute;
  left: 0;
  height: 100%;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
`

export const ChecklistStepItem = styled.div`
  flex-direction: row;
  justify-content: flex-start;
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
  padding-right: 16px;
`
