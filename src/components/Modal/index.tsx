import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { ModalBackground } from './ModalBackground'
import { CloseIcon } from '../CloseIcon'
import { getClassName, getCustomClassOverrides } from '../../shared/appearance'
import { Appearance } from '../../types'

const ModalContainer = styled.div<{ appearance }>`
  :not(${(props) => getCustomClassOverrides(props)}) {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: ${(props) => props.appearance?.theme?.colorBackground};
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

    z-index: 110;
  }
  border-radius: 6px;
  padding: 32px 32px 24px 32px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
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
`

const ModalHeader = styled.div`
  position: relative;
  flex: 1;
`

const ModalClose = styled.div<{ appearance }>`
  position: absolute;
  top: 16px;
  right: 16px;
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
      <ModalBackground appearance={appearance} onClose={onClose} />
      <ModalContainer
        appearance={appearance}
        className={getClassName('modalContainer', appearance)}
        style={style}
      >
        <ModalClose
          className={getClassName('modalClose', appearance)}
          onClick={() => onClose()}
          appearance={appearance}
        >
          <CloseIcon />
        </ModalClose>
        {headerContent && <ModalHeader>{headerContent}</ModalHeader>}
        <Body>{children}</Body>
      </ModalContainer>
    </>
  )
}
