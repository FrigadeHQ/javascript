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
  } else if (videoUri.includes('loom')) {
    const videoId = videoUri.split('loom.com/share/')[1]?.split('&')[0]

    return `https://loom.com/embed/${videoId}?hideEmbedTopBar=true&hide_title=true&hide_share=true&hide_owner=true`
  }

  return null
}

export interface VideoProps extends BoxProps {
  src: string
}

export function Video({ part, src, ...props }: VideoProps) {
  const videoEmbedSrc = getVideoEmbedSrc(src)

  if (!videoEmbedSrc) {
    // Check if it's a url that ends in .mp4
    if (src?.endsWith('.mp4')) {
      return <Box as="video" controls part={['video', part]} src={src} {...props}></Box>
    }

    console.error(
      `Could not map videoUri ${src} to a known provider (Youtube, Vimeo, Wistia, Loom) or valid mp4 file.`
    )
    return null
  }

  return (
    <Box
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      as="iframe"
      backgroundColor="gray100"
      borderWidth="0"
      part={['video', part]}
      src={videoEmbedSrc}
      {...props}
    ></Box>
  )
}
