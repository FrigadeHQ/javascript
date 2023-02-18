import React from 'react'
import { StepData } from '../../types'

interface Link {
  title?: string
  uri?: string
  imageUri?: string
}

export function LinkCollectionStepType({ stepData }: { stepData: StepData }) {
  return (
    <div>
      <h1>{stepData.title}</h1>
      <h2>{stepData.subtitle}</h2>
      <div>
        {stepData.props?.links?.map((link: Link) => (
          <div key={link.title}>
            <img src={link.imageUri} />
            <button
              onClick={() => {
                if (link.uri) {
                  window.open(link.uri, '_blank')
                }
              }}
            >
              {link.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
