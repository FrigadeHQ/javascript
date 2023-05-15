import styled, { css, keyframes } from 'styled-components'

const defaultBorder = css`
  border: 1px solid ${({ theme }) => theme.colorBorder};
`

const defaultShadow = css`
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.06);
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  } to {
    opacity: 0;
  }
`

export const CarouselScroll = styled.div`
  margin: 0 -20px;
  overflow-x: auto;
  padding-left: 20px;
  padding-right: 20px;
  scroll-snap-type: x mandatory;

  display: flex;
  flex-flow: row nowrap;
  gap: 0 16px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const CarouselScrollGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0 16px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`

export const StyledCarouselFade = styled.div`
  animation: ${(props) => (props.reversed ? fadeOut : fadeIn)} 0.25s ease-out;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colorBackground}00,
    ${({ theme }) => theme.colorBackground} 100%
  );
  position: absolute;
  width: 64px;
`

export const StyledScrollButton = styled.button`
  ${defaultBorder}
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  align-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colorBackground};
  display: flex;
  height: 48px;
  justify-content: center;
  position: absolute;
  width: 48px;
`

export const Card = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius}px;
  padding: 20px;
`

export const StyledCarouselCard = styled(Card)`
  ${defaultBorder}
  background: ${({ theme }) => theme.colorBackground};

  &:active {
    background: #fafdff;
  }
  &:hover {
    border: 1px solid #0b93ff;
    cursor: pointer;
  }
`

export const StyledCarouselCardImage = styled.img`
  border-radius: 50%;
  height: 40px;
  margin-bottom: 12px;
  width: 40px;
`

export const CarouselContainer = styled(Card)`
  ${defaultShadow}

  background: ${({ theme }) => theme.colorBackground};
`

export const CompletedPill = styled.div`
  background: #d8fed8;
  border-radius: 6px;
  margin-bottom: 12px;
  padding: 4px 10px;
`

export const H3 = styled.p`
  font: bold 18px/22px Inter;
  letter-spacing: calc(18px * -0.01);
  margin: 0;
`

export const H4 = styled.p`
  font: bold 16px/20px Inter;
  letter-spacing: calc(16px * -0.01);
  margin: 0;
`

export const Body = styled.p`
  color: ${({ theme }) => theme.colorText};
  font: normal 14px/22px Inter;
  margin: 0;
`

export const Small = styled.p`
  color: ${({ theme }) => theme.colorText};
  font: 600 12px/16px Inter;
  margin: 0;
`

Body.Loud = styled(Body)`
  font-weight: 600;
`

Body.Quiet = styled(Body)`
  color: ${({ theme }) => theme.colorTextSecondary};
`
