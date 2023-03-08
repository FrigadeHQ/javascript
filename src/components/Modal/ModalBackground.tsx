import React from 'react'
import styled from 'styled-components'
import { getClassName, getCustomClasOverrides } from '../../shared/appearance'

const Background = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  :not(${(props) => getCustomClasOverrides(props)}) {
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
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
