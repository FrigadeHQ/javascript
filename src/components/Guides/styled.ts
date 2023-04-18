import styled from 'styled-components'
import { getCustomClassOverrides } from '../../shared/appearance'

export const GuideContainer = styled.div`
  border: 1px solid #fafafa;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const GuideItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  row-gap: 10px;
`

export const GuideTitle = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    color: #595959;
  }
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.09em;
  margin-bottom: 12px;
`

export const GuideItem = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
    border: 1px solid #fafafa;
  }
  border-radius: 14px;
  padding: 20px;
  flex-direction: column;
  align-content: center;

  max-width: 150px;
  min-width: 200px;
`

export const GuideIconWrapper = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    background: radial-gradient(50% 50% at 50% 50%, #ffffff 0%, #f7f7f7 100%);
  }
  width: 40px;
  height: 40px;

  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`

export const GuideIcon = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  width: 20px;
  height: 20px;
`

export const GuideItemTitle = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    color: #434343;
  }
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-top: 12px;
  margin-bottom: 8px;
`

export const GuideItemSubtitle = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    color: #8c8c8c;
  }
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`

export const GuideItemLink = styled.a<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  cursor: pointer;
`
