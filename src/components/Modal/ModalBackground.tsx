import React from 'react'
import styled from 'styled-components'

const Background = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 50;
`

export const ModalBackground = ({ onClose }) => {
  return <Background onClick={() => onClose()}></Background>
}
