import React, { FC } from 'react'
import styled from 'styled-components'

import { ModalBackground } from './ModalBackground'
import { CloseIcon } from '../CloseIcon'

const ModalContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  z-index: 55;
  padding: 32px 32px 24px 32px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  min-width: 500px;
  min-height: 600px;
  max-height: 600px;

  display: flex;
  flex-direction: column;
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
}

export const Modal: FC<ModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  style = null,
  children,
}) => {
  if (!visible) return <></>

  // If user presses escape key, close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      <ModalBackground onClose={onClose} />
      <ModalContainer style={style}>
        <ModalClose onClick={() => onClose()}>
          <CloseIcon />
        </ModalClose>
        {headerContent && <ModalHeader>{headerContent}</ModalHeader>}
        <Body>{children}</Body>
      </ModalContainer>
    </>
  )
}
