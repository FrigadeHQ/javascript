import styled from 'styled-components'

export const GuideContainer = styled.div`
  border: 1px solid #fafafa;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`

export const GuideItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
`

export const GuideTitle = styled.div`
  color: #595959;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.09em;
`

export const GuideItem = styled.div`
  background: #ffffff;
  border: 1px solid #fafafa;
  border-radius: 14px;
  padding: 20px;
  flex-direction: column;
  align-content: center;

  max-width: 150px;
  min-width: 200px;
`

export const GuideIconWrapper = styled.div`
  width: 40px;
  height: 40px;

  background: radial-gradient(50% 50% at 50% 50%, #ffffff 0%, #f7f7f7 100%);
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
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #434343;
  margin-top: 12px;
  margin-bottom: 8px;
  color: #434343;
`

export const GuideItemSubtitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #8c8c8c;
`

export const GuideItemLink = styled.a<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
`
