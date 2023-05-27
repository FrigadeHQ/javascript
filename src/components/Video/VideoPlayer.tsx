import React from 'react'
import { getClassName } from '../../shared/appearance'
import { Appearance } from '../../types'

export function VideoPlayer(props: { videoUri: string; appearance?: Appearance }) {
  if (props.videoUri.includes('youtube')) {
    let videoId = props.videoUri.split('v=')[1]
    const ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition)
    }
    return (
      <iframe
        width="480"
        height="260"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={getClassName('checklistStepVideo', props.appearance)}
      />
    )
  } else {
    return <video width="480" height="260" controls src={props.videoUri} />
  }
}
