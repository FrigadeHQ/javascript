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
    // Create flex design that has 3 videos in a row. If it's a youtube video, get the thumbnail for each video
    // and display it. Onclick go to youtube. If it's a video file, display the video file using the native player.
    // If there are more than 3 videos, display a "next" button that will scroll the videos to the right.
    // Add HeroIcon play icon on top of each video

    // If there are less than 3 videos, display the videos in a row with the same spacing as if there were 3 videos.

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
