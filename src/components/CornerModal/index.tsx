import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { Portal } from 'react-portal'
import { Appearance } from '../../types'
import { getClassName, getCustomClasOverrides } from '../../shared/appearance'
import { CloseIcon } from '../CloseIcon'

const CornerModalContainer = styled.div`
  :not(${(props) => getCustomClasOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
  }
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 28px;
  margin-bottom: 28px;
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

interface CornerModalProps {
  onClose: () => void
  visible: boolean
  headerContent?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
  appearance?: Appearance
}

export const CornerModal: FC<CornerModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  style = null,
  children,
  appearance,
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

  return (
    <Portal>
      <CornerModalContainer
        className={getClassName('cornerModalContainer', appearance)}
        style={style}
      >
        <CornerModalClose
          className={getClassName('cornerModalClose', appearance)}
          onClick={() => onClose()}
        >
          <CloseIcon />
        </CornerModalClose>
        {headerContent && <CornerModalHeader>{headerContent}</CornerModalHeader>}
        <Body>{children}</Body>
      </CornerModalContainer>
    </Portal>
  )
}
