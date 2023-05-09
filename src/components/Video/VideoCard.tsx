import { Play } from '../Icons/Play'
import { Appearance } from '../../types'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

const Video = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`

const PlayIconWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  z-index: 10;

  > svg {
    width: 40px;
    height: 40px;
    color: ${(props) => props.appearance.theme.colorBackground};
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.06);
    border-radius: 50%;
  }
`
const VideoSource = styled.video`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`
const YouTubeVideoSource = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

export function VideoCard({ appearance, videoUri }: { appearance: Appearance; videoUri: string }) {
  // Create ref to use with videoplayer

  const ref = useRef<any>()

  const [isPlaying, setIsPlaying] = useState(false)

  if (videoUri.includes('youtube')) {
    let videoId = videoUri.split('v=')[1]
    const ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition)
    }
    return (
      <YouTubeVideoSource
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        appearance={appearance}
      />
    )
  }

  return (
    <Video appearance={appearance}>
      {!isPlaying && (
        <PlayIconWrapper
          onClick={() => {
            setIsPlaying(true)
            ref.current.play()
          }}
          appearance={appearance}
        >
          <Play />
        </PlayIconWrapper>
      )}
      <VideoSource
        appearance={appearance}
        controls={isPlaying}
        ref={ref}
        play={isPlaying}
        src={videoUri}
      />
    </Video>
  )
}
