import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { ModalBackground } from './ModalBackground'
import { Close } from '../Icons/Close'
import { getClassName, getCustomClassOverrides, styleOverridesToCSS } from '../../shared/appearance'
import { Appearance } from '../../types'
import { Portal } from 'react-portal'

export type ModalPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

const ModalContainer = styled.div<{ appearance; maxWidth }>`
  ${(props) => getCustomClassOverrides(props)} {
    // Anything inside this block will be ignored if the user provides a custom class
    background-color: ${(props) => props.appearance?.theme?.colorBackground};
    /* Mobile */
    @media (max-width: 500px) {
      width: 90%;
      height: 90%;
      top: 50%;
      left: 50%;
    }

    width: ${(props) => props.width ?? '1000px'};

    z-index: 1500;

    border-radius: ${(props) => props.appearance?.theme?.borderRadius ?? 8}px;

    ${(props) => styleOverridesToCSS(props)}
  }

  padding: 32px;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;

  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-name: fadeIn;
  box-sizing: border-box;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const ModalHeader = styled.div`
  position: relative;
  flex: 0 1 auto;
`

const ModalClose = styled.div<{ appearance }>`
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
  flex: 1 1;
  display: flex;
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
  appearance?: Appearance
  dismissible?: boolean // defaults to true
}

export const Modal: FC<ModalProps> = ({
  onClose,
  visible,
  headerContent = null,
  style = null,
  children,
  appearance,
  dismissible = true,
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
    <Portal>
      <ModalBackground
        appearance={appearance}
        onClose={() => {
          if (dismissible) {
            onClose()
          }
        }}
      />
      <ModalContainer
        appearance={appearance}
        className={getClassName('modalContainer', appearance)}
        styleOverrides={style}
      >
        {dismissible && (
          <ModalClose
            className={getClassName('modalClose', appearance)}
            onClick={() => onClose()}
            appearance={appearance}
          >
            <Close />
          </ModalClose>
        )}
        {headerContent && <ModalHeader>{headerContent}</ModalHeader>}
        <Body>{children}</Body>
      </ModalContainer>
    </Portal>
  )
}
