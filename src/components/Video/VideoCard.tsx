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
  border-radius: ${(props) => props.appearance.theme.borderRadius}px;
`

export function VideoCard({ appearance, videoUri }: { appearance: Appearance; videoUri: string }) {
  // Create ref to use with videoplayer

  const ref = useRef<any>()

  const [isPlaying, setIsPlaying] = useState(false)

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
