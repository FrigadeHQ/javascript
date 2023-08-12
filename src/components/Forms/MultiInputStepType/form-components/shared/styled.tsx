import styled from 'styled-components'
import { getCustomClassOverrides } from '../../../../../shared/appearance'

export const FormLabel = styled.label`
  ${(props) => getCustomClassOverrides(props)} {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 5px;
    margin-top: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.24px;
  }
  display: flex;
`

export const FormSubLabel = styled.label`
  ${(props) => getCustomClassOverrides(props)} {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }
  display: flex;
`

export const RequiredSymbol = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.appearance?.theme?.colorTextError};
  display: flex;
  margin-right: 5px;
  margin-top: 10px;
`

export const LabelWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: left;
  margin-bottom: 10px;
`
