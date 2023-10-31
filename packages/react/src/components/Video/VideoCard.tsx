import { Play } from '../Icons/Play'
import { Appearance } from '../../types'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { getClassName } from '../../shared/appearance'

const VideoPlayerWrapper = styled.div`
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
const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`
const YouTubeVideoSource = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 260px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

const VimeoVideoSource = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`
const WistiaVideoSource = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

export function VideoCard({
  appearance,
  videoUri,
  autoplay = false,
}: {
  appearance: Appearance
  videoUri: string
  autoplay?: boolean
}) {
  // Create ref to use with videoplayer

  const ref = useRef<any>()

  const [isPlaying, setIsPlaying] = useState(autoplay)

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
        className={getClassName('youtubePlayer', appearance)}
      />
    )
  }
  // Check if vimeo
  if (videoUri.includes('vimeo')) {
    let videoId = videoUri.split('vimeo.com/')[1]
    const ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition)
    }
    return (
      <VimeoVideoSource
        width="100%"
        height="100%"
        src={`https://player.vimeo.com/video/${videoId}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        appearance={appearance}
        className={getClassName('vimeoPlayer', appearance)}
      />
    )
  }
  // Check if wistia
  if (videoUri.includes('wistia')) {
    let videoId = videoUri.split('wistia.com/medias/')[1]
    const ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition)
    }
    return (
      <WistiaVideoSource
        width="100%"
        height="100%"
        src={`https://fast.wistia.net/embed/iframe/${videoId}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        appearance={appearance}
        className={getClassName('wistiaPlayer', appearance)}
      />
    )
  }

  return (
    <VideoPlayerWrapper
      className={getClassName('videoPlayerWrapper', appearance)}
      appearance={appearance}
    >
      {!isPlaying && (
        <PlayIconWrapper
          onClick={() => {
            setIsPlaying(true)
            ref.current.play()
          }}
          appearance={appearance}
          className={getClassName('playIconWrapper', appearance)}
        >
          <Play />
        </PlayIconWrapper>
      )}
      <Video
        appearance={appearance}
        controls={isPlaying}
        ref={ref}
        play={isPlaying}
        src={videoUri}
        autoPlay={autoplay}
        muted={autoplay}
      />
    </VideoPlayerWrapper>
  )
}
