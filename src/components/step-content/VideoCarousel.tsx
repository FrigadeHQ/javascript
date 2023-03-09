import React, { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import { TitleSubtitleWithCTA } from './shared/TitleSubtitleWithCTA'
import { StepContentProps } from '../../FrigadeForm/types'
import { Play } from '../Icons/Play'
import { TitleSubtitle } from './shared/TitleSubtitle'
import { CTA } from './shared/CTA'

const VideoCarouselContainer = styled.div`
  display: block;
`

const VideoList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0px;
  align-items: center;
  align-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
`

const Video = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-right: 16px;
`

const VideoSource = styled.video`
  width: 200px;
  height: 120px;
`

const VideoTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`

const PlayIconWrapper = styled.div`
  position: absolute;
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
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

interface VideoMetadata {
  uri: string
  thumbnailUri?: string
  title?: string
}

interface VideoCarouselProps {
  videos: VideoMetadata[]
}

export const VIDEO_CAROUSEL_TYPE = 'videoCarousel'

export const VideoCarousel: FC<StepContentProps> = ({ stepData, appearance }) => {
  if (!stepData.props?.videos) {
    return (
      <VideoCarouselContainer>
        <TitleSubtitleWithCTA stepData={stepData} appearance={appearance} />
      </VideoCarouselContainer>
    )
  }

  function VideoCard({ video, key }: { video: VideoMetadata; key: string }) {
    // Create ref to use with videoplayer

    const ref = useRef<any>()

    const [isPlaying, setIsPlaying] = useState(false)

    return (
      <Video key={key}>
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
        <VideoSource controls={isPlaying} ref={ref} play={isPlaying} src={video.uri} />
        <VideoTitle>{video.title}</VideoTitle>
      </Video>
    )
  }

  const videoProps = stepData.props as VideoCarouselProps

  if (videoProps.videos) {
    return (
      <VideoCarouselContainer>
        <TitleSubtitle stepData={stepData} appearance={appearance} />
        <VideoList>
          {videoProps.videos.map((video: VideoMetadata) => (
            <VideoCard key={video.uri} video={video} />
          ))}
        </VideoList>
        <CTA stepData={stepData} appearance={appearance} />
      </VideoCarouselContainer>
    )
  }
  return null
}
