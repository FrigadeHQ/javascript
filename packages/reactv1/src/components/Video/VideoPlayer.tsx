import React, { memo } from 'react'
import { Appearance } from '../../types'
import { VideoCard } from './VideoCard'

export const VideoPlayer = memo(function VideoPlayer(props: {
  videoUri: string
  autoplay: boolean
  appearance?: Appearance
  loop?: boolean
  hideControls?: boolean
}) {
  return (
    <VideoCard
      appearance={props.appearance}
      videoUri={props.videoUri}
      autoplay={props.autoplay}
      loop={props.loop}
      hideControls={props.hideControls}
    />
  )
})
