import React from 'react'
import { Appearance } from '../../types'
import { VideoCard } from './VideoCard'

export function VideoPlayer(props: { videoUri: string; appearance?: Appearance }) {
  return <VideoCard appearance={props.appearance} videoUri={props.videoUri} />
}
