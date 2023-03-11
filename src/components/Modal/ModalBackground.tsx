import React from 'react'
import styled from 'styled-components'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'

const Background = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  :not(${(props) => getCustomClassOverrides(props)}) {
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
  }
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-name: fadeIn;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export const ModalBackground = ({ onClose, appearance }) => {
  return (
    <Background
      className={getClassName('modalBackground', appearance)}
      onClick={() => onClose()}
    ></Background>
  )
}
