import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { Portal } from 'react-portal'
import { Appearance } from '../../types'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import { Close } from '../Icons/Close'

const CornerModalContainer = styled.div`
  :not(${(props) => getCustomClassOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background: #ffffff;
    position: fixed;
    right: 0;
    bottom: 0;
    margin-right: 28px;
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 1500;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    width: 350px;
    padding: 24px;
  }
`

const CornerModalHeader = styled.div`
  position: relative;
  flex: 1;
`

const CornerModalClose = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  :not(${(props) => getCustomClassOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    color: ${(props) => props.appearance?.theme?.colorText};
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
      <CornerModalContainer className={getClassName('cornerModalContainer', appearance)}>
        <CornerModalClose
          className={getClassName('cornerModalClose', appearance)}
          onClick={() => onClose()}
        >
          <Close />
        </CornerModalClose>
        {headerContent && <CornerModalHeader>{headerContent}</CornerModalHeader>}
        <Body>{children}</Body>
      </CornerModalContainer>
    </Portal>
  )
}
