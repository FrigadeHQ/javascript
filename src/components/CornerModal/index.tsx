import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { Portal } from 'react-portal'
import { Appearance } from '../../types'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import { Close } from '../Icons/Close'

function getModalPosition(
  modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
) {
  switch (modalPosition) {
    case 'top-left':
      return `
        top: 0;
        left: 0;
      `
    case 'top-right':
      return `
        top: 0;
        right: 0;
      `
    case 'bottom-left':
      return `
        bottom: 0;
        left: 0;
      `
  }

  return `right: 0; bottom: 0;`
}

const CornerModalContainer = styled.div`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background: ${(props) => props.appearance?.theme?.colorBackground};
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 1500;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    width: 350px;
    padding: 24px;
  }
  ${(props) => getModalPosition(props.modalPosition)}
  margin: 28px;
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
  z-index: 1501;
  ${(props) => getCustomClassOverrides(props)} {
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
  modalPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  dismissible?: boolean
}

export const CornerModal: FC<CornerModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  children,
  appearance,
  modalPosition = 'bottom-right',
  dismissible = true,
}) => {
  // If user presses escape key, close cornerModal
  useEffect(() => {
    if (!dismissible) {
      return
    }
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
        appearance={appearance}
        className={getClassName('cornerModalContainer', appearance)}
        modalPosition={modalPosition}
      >
        {dismissible && (
          <CornerModalClose
            className={getClassName('cornerModalClose', appearance)}
            onClick={() => onClose()}
          >
            <Close />
          </CornerModalClose>
        )}
        {headerContent && <CornerModalHeader>{headerContent}</CornerModalHeader>}
        <Body>{children}</Body>
      </CornerModalContainer>
    </Portal>
  )
}
