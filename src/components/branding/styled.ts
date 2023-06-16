import styled from 'styled-components'

export const PoweredByFrigadeModalRibbon = styled.div`
  background-color: ${(props) => props.appearance?.theme.colorBackground};
  position: absolute;
  bottom: -47px;
  left: 0;
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.appearance?.theme.borderRadius}px;
`

export const PoweredByFrigadeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => props.appearance?.theme?.colorTextSecondary};
`
