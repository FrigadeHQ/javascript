import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { CloseIcon } from '../CloseIcon'
import { Portal } from 'react-portal'

const CornerModalContainer = styled.div`
  background: #ffffff;
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 24px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 51;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  width: 300px;
  padding: 50px 16px 16px;
`

const CornerModalHeader = styled.div`
  position: relative;
  flex: 1;
`

const CornerModalClose = styled.div`
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

interface CornerModalProps {
  onClose: () => void
  visible: boolean
  headerContent?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
  closeTint?: string
}

export const CornerModal: FC<CornerModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  style = null,
  children,
  closeTint = '#000000',
}) => {
  // If user presses escape key, close cornerModal
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

  // TODO: Look for customer support widgets in the same container and if one is visible, place above.
  // Otherwise, below

  return (
    <Portal>
      <CornerModalContainer style={style}>
        <CornerModalClose onClick={() => onClose()}>
          <CloseIcon color={closeTint} />
        </CornerModalClose>
        {headerContent && <CornerModalHeader>{headerContent}</CornerModalHeader>}
        <Body>{children}</Body>
      </CornerModalContainer>
    </Portal>
  )
}
