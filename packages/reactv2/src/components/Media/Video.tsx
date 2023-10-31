import { Box, BoxProps } from '../Box'

function getVideoEmbedSrc(videoUri: string) {
  if (videoUri.includes('youtube')) {
    const videoId = videoUri.split('v=')[1]?.split('&')[0]

    return `https://www.youtube.com/embed/${videoId}`
  } else if (videoUri.includes('vimeo')) {
    const videoId = videoUri.split('vimeo.com/')[1]?.split('&')[0]

    return `https://player.vimeo.com/video/${videoId}`
  } else if (videoUri.includes('wistia')) {
    const videoId = videoUri.split('wistia.com/medias/')[1]?.split('&')[0]

    return `https://fast.wistia.net/embed/iframe/${videoId}`
  }

  throw new Error('Could not map videoUri to a known provider (Youtube, Vimeo, Wistia).')
}

export interface VideoProps extends BoxProps {
  src: string
}

export function Video({ src, ...props }: VideoProps) {
  const videoEmbedSrc = getVideoEmbedSrc(src)

  // TODO: Add play button overtop?
  return (
    <Box
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      as="iframe"
      backgroundColor="gray100"
      borderWidth={0}
      src={videoEmbedSrc}
      {...props}
    ></Box>
  )
}
