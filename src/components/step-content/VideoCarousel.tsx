import React, { FC } from 'react'
import styled from 'styled-components'
import { StepContentProps } from '../../FrigadeForm/types'

const VideoCarouselWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin: 0px 0px 16px 0px;
`

interface VideoMetadata {
  uri: string
  thumbnailUri?: string
  title?: string
}

interface VideoPreviewImageProps {
  videos: VideoMetadata[]
}

export const VIDEO_CAROUSEL_TYPE = 'videoCarousel'

export const VideoCarousel: FC<StepContentProps> = ({ stepData, appearance }) => {
  function VideoPreviewImage({ url }: { url: string }) {
    // Check if URL is YouTube. If it is, get the thumbnail for the video and display it.
  }

  if (stepData.videoUris) {
    return (
      <VideoCarouselWrapper>
        {stepData.videoUris.map((videoUri) => {
          return <VideoPreviewImage url={videoUri} />
        })}
      </VideoCarouselWrapper>
    )
  }
  return null
}
