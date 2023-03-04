import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { ModalBackground } from './ModalBackground'
import { CloseIcon } from '../CloseIcon'
import { getClassName, getCustomClasOverrides } from '../../shared/appearance'
import { Appearance } from '../../types'

const ModalContainer = styled.div`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
    /* Mobile */
    @media (max-width: 500px) {
      width: 90%;
      height: 90%;
      top: 50%;
      left: 50%;
    }

    @media (min-width: 501px) {
      width: 90%;
    }

    @media (min-width: 1000px) {
      width: 1000px;
    }
    width: 1000px;
  }
  border-radius: 6px;
  z-index: 110;
  padding: 32px 32px 24px 32px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  position: relative;
  flex: 1;
`

const ModalClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    color: #000000;
  }
`

const Body = styled.div`
  overflow: scroll;
  flex: 5;
  ::-webkit-scrollbar {
    display: none;
  }
`

interface ModalProps {
  onClose: () => void
  visible: boolean
  headerContent?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
  closeTint?: string
  appearance?: Appearance
}

export const Modal: FC<ModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  style = null,
  children,
  appearance,
}) => {
  // If user presses escape key, close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose, visible])

  if (!visible) return <></>

  return (
    <>
      <ModalBackground onClose={onClose} />
      <ModalContainer className={getClassName('modalContainer', appearance)} style={style}>
        <ModalClose className={getClassName('modalClose', appearance)} onClick={() => onClose()}>
          <CloseIcon />
        </ModalClose>
        {headerContent && <ModalHeader>{headerContent}</ModalHeader>}
        <Body>{children}</Body>
      </ModalContainer>
    </>
  )
}
