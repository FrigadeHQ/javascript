import styled from 'styled-components'

export const GuideContainer = styled.div`
  border: 1px solid #FAFAFA;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`

export const GuideItems = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow-y: scroll;
`

export const GuideTitle = styled.p`
  color: #595959;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
`

export const GuideItem = styled.div`
  background: #FFFFFF;
  border: 1px solid #FAFAFA;
  border-radius: 14px;
  padding: 20px;
  margin: auto;
  flex-direction: column;
  align-content: left;

  max-width: 25%;
  min-width: 200px;
  margin: 16px;
`

export const GuideIconWrapper = styled.div`
  width: 40px;
  height: 40px;

  background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #F7F7F7 100%);
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`

export const GuideIcon = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  width: 20px;
  height: 20px;
`

export const GuideItemTitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #434343;
  margin-top: 12px;
  margin-bottom: 8px;
  color: #434343;
`

export const GuideItemSubtitle = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #8C8C8C;
`

export const GuideItemLink = styled.a<{color: string}>`
  color: ${(props) => props.color};
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
`