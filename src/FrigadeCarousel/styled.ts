import styled from 'styled-components'

// TODO: Convert this to a Card component
export const Card = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 20px;
`

export const CarouselContainer = styled(Card)`
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .06);
`

export const CarouselItems = styled.div`
  display: flex;
  gap: 0 16px;
`

export const CarouselScroll = styled.div`
  margin: 0 -20px;
  overflow-x: auto;
  padding-left: 20px;
  padding-right: 20px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const CarouselFade = styled.div`
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 130%);
  position: absolute;
  width: 56px;
`

export const CarouselCard = styled(Card)`
  flex: 1;
`

export const H3 = styled.p`
  font: bold 17px/21px Inter;
  letter-spacing: calc(17px * -0.01);
  margin: 0;
`

export const H4 = styled.p`
  font: bold 15px/18px Inter;
  letter-spacing: calc(15px * -0.01);
  margin: 0;
`

export const Body = styled.p`
  font: normal 15px/22px Inter;
  margin: 0;
`

export const Body2 = styled.p`
  font: normal 13px/20px Inter;
  margin: 0;
`
