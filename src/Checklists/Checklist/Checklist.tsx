import React, { CSSProperties, FC } from 'react'
import { CloseIcon } from '../../components/CloseIcon'
import { CheckBox } from '../../components/CheckBox'

import { ProgressBar } from './Progress'
import { getPositionStyle } from './styles'
import {
  ChecklistHeader,
  ChecklistHeaderTop,
  ChecklistListContainer,
  ChecklistListItem,
  ChecklistSubtitle,
  ChecklistTitle,
  ChecklistWrapper,
} from './styled'

export type CheckListPosition = 'top-left' | 'top-center' | 'top-right'

interface StepProp {
  text: string
  complete: boolean
}

export interface ChecklistProps {
  title: string
  subtitle: string
  steps: StepProp[]
  onDismiss?: () => void
  displayProgress?: boolean
  displayMode?: 'Inline' | 'Modal'
  position?: CheckListPosition
  positionOffset?: number | string
  style?: CSSProperties
  primaryColor?: string
}

const Checklist: FC<ChecklistProps> = ({
  title,
  subtitle,
  steps,
  primaryColor,
  onDismiss,
  positionOffset,
  position = 'top-right',
  displayProgress = true,
  displayMode = 'Inline',
  style = {},
}) => {
  const completeCount = steps.filter((s) => s.complete).length
  const positionStyle = displayMode === 'Modal' ? getPositionStyle(position, positionOffset) : {}

  const wrapperDisplayModeStyle =
    displayMode === 'Modal'
      ? { position: 'fixed' as 'fixed' }
      : {
          margin: 20,
        }

  return (
    <ChecklistWrapper style={{ ...positionStyle, ...wrapperDisplayModeStyle, ...style }}>
      <ChecklistHeader>
        <ChecklistHeaderTop>
          <ChecklistTitle>{title}</ChecklistTitle>
          {onDismiss && (
            <div
              onClick={onDismiss}
              style={{
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <CloseIcon />
            </div>
          )}
        </ChecklistHeaderTop>
        <ChecklistSubtitle>{subtitle}</ChecklistSubtitle>
      </ChecklistHeader>
      <div className="ProgressWrapper">
        {displayProgress && (
          <ProgressBar total={steps.length} count={completeCount} fillColor={primaryColor} />
        )}
      </div>
      <div className="Checklist-Content">
        <ChecklistListContainer>
          {steps.map((s, idx) => {
            return (
              <ChecklistListItem key={`checkbox-step-${idx}`} role="listitem">
                <CheckBox
                  value={s.complete}
                  label={s.text}
                  index={idx}
                  length={steps.length}
                  style={{ justifyContent: 'flex-start' }}
                  primaryColor={primaryColor}
                />
              </ChecklistListItem>
            )
          })}
        </ChecklistListContainer>
      </div>
    </ChecklistWrapper>
  )
}

export default Checklist
