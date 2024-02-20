import styled from 'styled-components'

export const ChecklistTitle = styled.h1`
  display: flex;
  margin: 0;
  font-size: 18px;
`

export const ChecklistSubtitle = styled.h2`
  font-size: 15px;
  color: #4d4d4d;
`

export const ProgressBarFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: ${(props) => props.barHeight};
  width: ${(props) => props.fgWidth};
  border-radius: 20px;
  background-color: ${(props) => props.theme.colorPrimary};
  transition: width 0.5s;
`
export const ProgressBarBackground = styled.div`
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  min-width: 40px;
  height: ${(props) => props.barHeight};
  border-radius: 20px;
  background-color: ${(props) => props.theme.colorPrimary};
  opacity: 0.12;
`
